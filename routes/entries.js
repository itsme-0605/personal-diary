const express=require('express')
 const router=express.Router()
 const {ensureAuth}=require('../middleware/auth')

 const Entry=require('../models/Entry')
 //show add page
 // GET request GET/entries/add

 router.get('/add',ensureAuth,(req,res)=>{
  res.render('entries/add')
 })

 //process add form
 //POST request POST/entries
 router.post('/',ensureAuth,async(req,res)=>{
    try{
  req.body.user=req.user.id
  await Entry.create(req.body)
      res.redirect('/dashboard')  
    }catch (err){
        console.log(err)
        res.render('error/500')
    }
   })

   //show single entry
   // GET/entries/:id
   router.get('/:id',ensureAuth,async(req,res)=>{
    try{
      let entry=await Entry.findById(req.params.id)
      .populate('user')
      .lean()
      if(!entry)
      {
          return res.render('error/404')
      }
      res.render('entries/show',{
          entry
      })
    }
    catch(err){
     console.log(err)
     res.render('error/404')
    }
   })

   //show edit page
   //GET/entries/edit/:id
   router.get('/edit/:id',ensureAuth,async(req,res)=>{
       const entry=await Entry.findOne({
           _id:req.params.id
       }).lean()
       if(!entry)
       {
       return res.render('error/404')
       }
       if(entry.user!=req.user.id){
           res.redirect('/')
       }
       else
       {
           res.render('entries/edit',{
               entry
           })
       }
   })

   //update entries
   //PUT/entries/:id
   router.put('/:id',ensureAuth,async(req,res)=>{
       try{
        let entry=await Entry.findById(req.params.id).lean()
    
        if(!entry){
            return res.render('error/404')
        }
        if(entry.user!=req.user.id){
            res.redirect('/')
        }
        else
        {
            entry=await Entry.findOneAndUpdate({_id:req.params.id},req.body,{
                new:true,
                runValidators:true,
            })
            res.redirect('/dashboard')
        }

       }catch{
        console.log(err)
        return res.render('error/500')
       }
    
})

//delete request
//DELETE/entries/:id
router.delete('/:id',ensureAuth,async(req,res)=>{
    try{
  await Entry.remove({_id:req.params.id})
  res.redirect('/dashboard')
    }catch{
      console.log(err)
      return res.render('error/500')
    }
   })
  

  module.exports=router