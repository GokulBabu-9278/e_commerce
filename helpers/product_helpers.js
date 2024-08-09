var db = require('../config/connection')
var collection = require('../config/collections')
const { response } = require('express')
var objectId = require('mongodb').ObjectId

module.exports = {
    addProduct:(product, callback)=>{
        //console.log(product)
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data)=>{
            //console.log(data)
            callback(data.insertedId)
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve, rej)=>{
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products) //pass to then in admin.js
        })
    },
    deleteProduct:(proId)=>{
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(proId)}).then((response)=>{
                console.log(response)
                resolve(response)
            })
        })
    },
    getProductDetails:(proId)=>{
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(proId, proDetails)=>{
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:objectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    Description:proDetails.Description,
                    Price:proDetails.Price,
                    Category:proDetails.Category
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    doSignup:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            adminData.Password = await bcrypt.hash(adminData.Password, 10)
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data)=>{
                resolve(data.insertedId)
            })
        })
    },
    doLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false
            let response = {}
            let admin = await db.get().collection(collection.admin_COLLECTION).findOne({Email:adminData.Email})
            if(admin){
                bcrypt.compare(adminData.Password,user.Password).then((status)=>{
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
    }

}