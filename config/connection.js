const mongoClient = require('mongodb').MongoClient
const state={
    db:null
}
module.exports.connect = function(done){
    const url = 'mongodb+srv://gokulbabu9278:nb%40gokul$9278@e-commerce.ntifb.mongodb.net/?retryWrites=true&w=majority&appName=E-Commerce'
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