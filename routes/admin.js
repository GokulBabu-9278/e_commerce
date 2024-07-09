var express = require('express');
const product_helpers = require('../helpers/product_helpers');
var router = express.Router();

var productHelper = require('../helpers/product_helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelper.getAllProducts().then((products)=>{  // promise reason for then
    //console.log(products)
    res.render('admin/view_products', {admin:true, products})
  })
});

router.get('/add_product', (req, res)=>{
  res.render('admin/add_product')
})

router.post('/add_product', (req, res)=>{
  //console.log(req.body)
  //console.log(req.files.Image)

  productHelper.addProduct(req.body, (id)=>{  // call back not promise
    let image = req.files.Image
    //console.log(id)
    image.mv('./public/product_image/'+id+'.jpg',(err)=>{
      if(!err){
        res.render('admin/add_product')   
      }else{console.log(err)}})
  })
})

module.exports = router;