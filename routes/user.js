var express = require('express');
var router = express.Router();

const productHelper = require('../helpers/product_helpers')
const userHelper = require('../helpers/user_helpers')
const verifyLogin = (req, res, next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

router.get('/', function(req, res, next) {

  //login session
  let user = req.session.user
  console.log(user)

  productHelper.getAllProducts().then((products)=>{
    //console.log(products)
    res.render('user/user_view_products', {admin:false, products, user})
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
router.get('/cart', verifyLogin, (req, res)=>{
  res.render('user/cart')
})
module.exports = router;