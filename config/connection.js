const mongoClient = require('mongodb').MongoClient
const state={
    db:null
}
module.exports.connect = function(done){
    const url = 'mongodb://localhost:27017/'
    const dbname = 'shopping'

    mongoClient.connect(url,(err, data)=>{
        if(err) return done(err)
        state.db = data.db(dbname)
        done()
    })  
}
module.exports.get = function(){
    return state.db
}

// npm i mongodb@3.6.2 
// npm i mongodb@4.6.0  preferd

const { MongoClient } = require('mongodb')
const url = 'mongodb+srv://gokulbabu9278:nb%40gokul$9278@e-commerce.ntifb.mongodb.net/?retryWrites=true&w=majority&appName=E-Commerce'
const client = new MongoClient(url)
const dbname = 'shopping'

module.exports.connect = async function(){
    await client.connect()
    console.log('connect to server')
    state.db = client.db(dbname)
}
module.exports.get = function(){
    return state.db
}
//npm i mongodb@6.8.0