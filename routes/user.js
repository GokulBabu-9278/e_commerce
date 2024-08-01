var express = require('express');
var router = express.Router();

const productHelper = require('../helpers/product_helpers')
const userHelper = require('../helpers/user_helpers');
const { USER_COLLECTION } = require('../config/collections');
const verifyLogin = (req, res, next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

router.get('/', async function(req, res, next) {

  //login session checking
  let user = req.session.user
  //console.log(user)
  let cartCount = null
  if(req.session.user){
    cartCount = await userHelper.getCartCount(req.session.user._id)
  }
  productHelper.getAllProducts().then((products)=>{
    //console.log(products)
    res.render('user/user_view_products', {products, user, cartCount})
  })
})

router.get('/login', (req, res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
  res.render('user/login', {"loginErr":req.session.loginErr})
  req.session.loginErr = false
  }
})
router.get('/signup', (req, res)=>{
  res.render('user/signup')
})
router.post('/signup', (req, res)=>{
  userHelper.doSignup(req.body).then((response)=>{
    console.log(response)
    req.session.loggedIn = true
    req.session.user = response
    res.redirect('/')
  })
  res.render('user/login')
})
router.post('/login',(req, res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    }else{
      req.session.loginErr = "invalid name or passowrd"
      res.redirect('/login')
    }
  })
})
router.get('/logout', (req, res)=>{
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart', verifyLogin, async(req, res)=>{
  let products = await userHelper.getCartProducts(req.session.user._id)
  //console.log(products)
  res.render('user/cart', {products, user:req.session.user})
})
router.get('/add_tocart/:id', (req, res)=>{
  //console.log("api call")
  userHelper.addToCart(req.params.id, req.session.user._id).then(()=>{
    res.json({status:true})
  })
})
router.post('/change_product_quantity', (req, res, next)=>{
  console.log(req.body)
  userHelper.changeProdQuan(req.body).then((response)=>{
    res.json(response)
  })
})
module.exports = router;