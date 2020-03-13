
const mongoose = require('mongoose')
const schema = mongoose.Schema

let userSchema = new schema({
    userId: {
        type: String,
        default: '',
        index: true,
        unique: true
    },
    firstName: {
        type: String,
        default: '',
        required: true
    },
    lastName: {
        type: String,
        default: ''
    },
    mobileNumber: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        default: 'nausad1997',
        required: true
    },
    apiKey:{
        type:String,
        default:''
    },
    email: {
        type: String,
        default: '',
        required: true
    },
    createdOn: {
        type: Date,
        default: ''
    }

})



module.exports = mongoose.model('users', userSchema)