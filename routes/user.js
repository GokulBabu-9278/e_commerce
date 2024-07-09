var express = require('express');
var router = express.Router();

var productHelper = require('../helpers/product_helpers')

/* GET home page. */
router.get('/', function(req, res, next) {

  productHelper.getAllProducts().then((products)=>{  // promise reason for then
    //console.log(products)
    res.render('user/user_view_products', {admin:true, products})
  })
});

module.exports = router;
