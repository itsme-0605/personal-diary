const mongoose=require('mongoose')

 const EntrySchema =new mongoose.Schema({
     title:{
      type:String,
      required:true,
      trim:true
     },
      about:{
        type:String,
        required:true,
        trim:true
       },
       body:{
        type:String,
        required:true
       },
       user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
       },
    createdAt:{
        type:Date,
        default:Date.now
       }

 })

 module.exports=mongoose.model('Entry',EntrySchema)