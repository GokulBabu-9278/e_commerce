var db = require('../config/connection')
var collection = require('../config/collections')

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
    }

}