const mongoose=require('mongoose')
const schema=mongoose.Schema

let socketModel=new schema({
    chatId:{
        type:String,
        default:'',
        unique:true,
        required:true
    },
    senderId:{
        type:String,
        default:''
    },
    senderName:{
        type:String,
        default:''
    },
    receiverId:{
        type:String,
        default:''
    },
    receiverName:{
        type:String,
        default:''
    },
    seen:{
        type:Boolean,
        default:false
    },
    chatRoom:{
        type:String,
        default:''
    },
    message:{
        type:String,
        default:''
    },
    createdOn:{
        type:Date,
        default:Date.now()
    },
    modifiedOn:{
        type:Date,
        default:Date.now()
    }
})

module.exports=mongoose.model('chatModel', socketModel)