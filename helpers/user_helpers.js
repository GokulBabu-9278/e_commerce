var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
const objectId = require('mongodb').ObjectId

module.exports = {
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.insertedId)
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log('Welcome user')
                        response.user = user
                        response.status = true
                        resolve(response)
                    }else{
                        console.log('login failed')
                        resolve({status:false})
                    }
                })
            }else{
                console.log('login failed')
                resolve({status:false})
            }
        })
    },
    addToCart:(proId, userId)=>{
        let proObj={
            item:objectId(proId),
            quantity:1
        }
        return new Promise(async(resolve, reject)=>{
           let userCart = await db.get().collection(collection.CART_COL).findOne({user:objectId(userId)})
           if(userCart){
                let proExist = userCart.products.findIndex(product=> product.item == proId)
                console.log(proExist)
                if(proExist !=-1){
                    db.get().collection(collection.CART_COL)
                    .updateOne({user:objectId(userId), 'products.item':objectId(proId)},
                    {$inc:{'products.$.quantity':1}})
                    .then(()=>{resolve()})
                }else{
                    db.get().collection(collection.CART_COL)
                        .updateOne({user:objectId(userId)},
                        {$push:{products:proObj}})
                        .then((response)=>{resolve()})
                    }
            }else{
                let cartObj = {user:objectId(userId),products:[proObj]}
                db.get().collection(collection.CART_COL).insertOne(cartObj)
                .then((response)=>{resolve()})
            }
        })
    },
    getCartProducts:(userId)=>{
        return new Promise(async(resolve, reject)=>{
            let cartItems = await db.get().collection(collection.CART_COL).aggregate([
                {$match:{user:objectId(userId)}},
                {$unwind:'$products'},
                {$project:{item:'$products.item', quantity:'$products.quantity'}},
                {$lookup:{from:collection.PRODUCT_COLLECTION, localField:'item', foreignField:'_id', as:'product'}},
                {$project:{item:1, quantity:1, product:{$arrayElemAt:['$product',0]}}}
            ]).toArray()
            resolve(cartItems)
        })
    },
    getCartCount:(userId)=>{
        return new Promise(async(resolve, reject)=>{
            let count = 0
            let cart = await db.get().collection(collection.CART_COL).findOne({user:objectId(userId)})
            if(cart){count = cart.products.length}
            resolve(count)
        })
    },
    changeProdQuan:(details)=>{
        details.count = parseInt(details.count)
        details.quantity = parseInt(details.quantity)
        return new Promise(async(resolve, reject)=>{
            if(details.count==-1 && details.quantity==1){
                db.get().collection(collection.CART_COL)
                    .updateOne({_id:objectId(details.cart)},
                    {$pull:{products:{item:objectId(details.product)}}}
                    ).then((response)=>{resolve({removeProduct:true})})
            }else{
                db.get().collection(collection.CART_COL)
                    .updateOne({_id:objectId(details.cart), 'products.item':objectId(details.product)},
                    {$inc:{'products.$.quantity':details.count}}
                    ).then((response)=>{resolve({status:true})})
                }
        })
    },
    getTotalAmount:(userId)=>{ //from getcartproduct
        return new Promise(async(resolve, reject)=>{
            let total = await db.get().collection(collection.CART_COL).aggregate([
                {$match:{user:objectId(userId)}},
                {$unwind:'$products'},
                {$project:{item:'$products.item', quantity:'$products.quantity'}},
                {$lookup:{from:collection.PRODUCT_COLLECTION, localField:'item', foreignField:'_id', as:'product'}},
                {$project:{item:1, quantity:1, product:{$arrayElemAt:['$product',0]}}},
                {$group:{_id:null, total:{$sum:{$multiply:['$quantity', {$toInt:'$product.Price'}]}}}}
            ]).toArray()
            //console.log(total[0].total)
            resolve(total[0].total)
        }) 
    },
    placeOrder:(order, prodList, totalPrice)=>{
        return new Promise((resolve, reject)=>{
            //console.log(order, prodList, totalPrice)
            let status = order['payment_method'] === 'COD'?'placed':'pending'
            let orderObj = {
                deliveryDetails:{
                    mobile:order.mobile, 
                    address:order.address, 
                    pincode:order.pincode
                },
                userId:objectId(order.userId),
                paymentMethod:order['payment_method'],
                product:prodList,
                Amount:totalPrice,
                status:status
            }
            //console.log(orderObj)
            db.get().collection(collection.ORD_COL).insertOne(orderObj).then((response)=>{
                db.get().collection(collection.CART_COL).deleteOne({user:objectId(order.userId)})
                resolve()
            })
        })
    },
    getCartProductlist:(userId)=>{
        return new Promise(async(resolve, reject)=>{
            let cart = await db.get().collection(collection.CART_COL).findOne({user:objectId(userId)})
                //console.log(cart)
                resolve(cart.products)
        })
    }
}