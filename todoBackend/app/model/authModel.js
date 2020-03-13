
const mongoose=require('mongoose')
const schema=mongoose.Schema

let authModel=new schema({
    userId:{
        type:String,
        unique:true
    },
    authToken:{
        type:String,
        required:true
    },
    secretKey:{
        type:String
    },
    createdOn:{
        type:Date,
        default:Date.now()
    }
})

module.exports=mongoose.model('Auth', authModel)