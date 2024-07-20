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
    }

}