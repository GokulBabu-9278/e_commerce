var express = require('express');
var router = express.Router();

var productHelper = require('../helpers/product_helpers')

/* GET home page. */
router.get('/', function(req, res, next) {

  productHelper.getAllProducts().then((products)=>{  // promise reason for then
    //console.log(products)
    res.render('user/user_view_products', {admin:false, products})
  })
});
router.get('/login', (req,res)=>{
  res.render('user/login')
})
router.get('/signup', (req,res)=>{
  res.render('user/signup')
})
router.post('/signup', (req,res)=>{
  
  console.log(req.body)
  res.render('user/login')
})

module.exports = router;