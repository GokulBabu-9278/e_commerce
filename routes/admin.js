var express = require('express');
const product_helpers = require('../helpers/product_helpers');
var router = express.Router();

var productHelper = require('../helpers/product_helpers');
const { route } = require('./user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelper.getAllProducts().then((products)=>{ 
    res.render('admin/view_products', {admin:true, products})
  })
});

router.get('/add_product', (req, res)=>{
  res.render('admin/add_product')
})

router.post('/add_product', (req, res)=>{
  productHelper.addProduct(req.body, (id)=>{
    let image = req.files.Image
    image.mv('./public/product_image/'+id+'.jpg',(err)=>{
      if(!err){
        res.render('admin/add_product')   
      }else{console.log(err)}})
  })
})
router.get('/delete_product/:id', (req, res)=>{
  let proId = req.params.id
  console.log(proId) //or console.log(req.query.name)?id
  productHelper.deleteProduct(proId).then((response)=>{
    res.redirect('/admin')
  })
})

module.exports = router;