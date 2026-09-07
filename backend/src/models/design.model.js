const mongoose = require('mongoose')
const schema = new mongoose.Schema({name:{type:String,required:true,trim:true},category:{type:String,required:true,trim:true},code:{type:String,required:true,unique:true,trim:true},description:String,basePrice:{type:Number,min:0,default:0},imageUrl:String,featured:{type:Boolean,default:false},status:{type:String,enum:['Draft','Published','Archived'],default:'Draft'},isDeleted:{type:Boolean,default:false,index:true},deletedAt:{type:Date,default:null}},{timestamps:true})
module.exports=mongoose.model('Design',schema)
