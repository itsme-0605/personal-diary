 const express=require('express')
 const router=express.Router()
 const {ensureAuth,ensureGuest}=require('../middleware/auth')

 const Entry=require('../models/Entry')
 //Login/landing page
 // GET request

 router.get('/',ensureGuest,(req,res)=>{
  res.render('login',{
    layout:'login',
  })
 })

 //Dashboard
 //get request
 router.get('/dashboard',ensureAuth,async(req,res)=>{
   try{
     const entries=await Entry.find({user:req.user.id}).lean()
     res.render('dashboard',{
      name:req.user.firstName,
      entries
  })
}
catch (err){
     console.error(err)
     res.render('error/500')
   }
   })

  module.exports=router