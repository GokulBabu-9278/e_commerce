var express = require('express');
var router = express.Router();

var productHelper = require('../helpers/product_helpers');
var userHelper = require('../helpers/user_helpers')
const { route } = require('./user');

const verifyLogin = (req, res, next)=>{
  if(req.session.admin.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET users listing. */
router.get('/',(req, res, next)=>{
  productHelper.getAllProducts().then((products)=>{ 
    res.render('admin/view_products', {admin:true, products})
  })
})

router.get('/add_product', (req, res)=>{
  res.render('admin/add_product', {admin:true})
})

router.post('/add_product', (req, res)=>{
  productHelper.addProduct(req.body, (id)=>{
    let image = req.files.Image
    image.mv('./public/product_image/'+id+'.jpg',(err)=>{
      if(!err){res.render('admin/add_product', {admin:true})   
      }else{console.log(err)}})
  })
})
router.get('/delete_product/:id', (req, res)=>{
  let proId = req.params.id
  // console.log(proId) //or console.log(req.query.name)?id
  productHelper.deleteProduct(proId).then((response)=>{
    res.redirect('/admin')
  })
})
router.get('/edit_product/:id', async(req, res)=>{
  let product = await productHelper.getProductDetails(req.params.id)
  // console.log(product)
  res.render('admin/edit_product', {admin:true, product})
})
router.post('/edit_product/:id', (req, res)=>{
  // console.log(req.params.id)
  let id = req.params.id
  productHelper.updateProduct(req.params.id, req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image = req.files.Image
      image.mv('./public/product_image/'+id+'.jpg')
    }
  })
})
router.get('/login', (req, res)=>{
  if(req.session.admin){
    res.redirect('/')
  }else{
  res.render('admin/login', {"loginErr":req.session.adminloginErr})
  req.session.adminloginErr = false
  }
})
router.get('/signup', (req, res)=>{
  res.render('admin/signup')
})
router.post('/signup', (req, res)=>{
  productHelper.doSignup(req.body).then((response)=>{
    console.log(response)
    req.session.admin = response
    req.session.adminloggedIn = true
    res.redirect('/')
  })
  res.render('user/login')
})
router.post('/login',(req, res)=>{
  productHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.admin = response.user
      req.session.adminloggedIn = true
      res.redirect('/')
    }else{
      req.session.userloginErr = "invalid name or passowrd"
      res.redirect('/login')
    }
  })
})
module.exports = router;