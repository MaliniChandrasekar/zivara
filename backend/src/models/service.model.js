const mongoose = require('mongoose')
const schema = new mongoose.Schema({name:{type:String,required:true,trim:true},category:{type:String,required:true,trim:true},description:String,startingPrice:{type:Number,min:0,default:0},durationDays:{type:Number,min:0,default:1},active:{type:Boolean,default:true},isDeleted:{type:Boolean,default:false,index:true},deletedAt:{type:Date,default:null}},{timestamps:true})
module.exports=mongoose.model('Service',schema)
