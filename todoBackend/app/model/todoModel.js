const mongoose = require('mongoose')
const schema = mongoose.Schema


let todoModel = new schema({
    userId: {
        type: String
    },
    todoId: {
        type: String,
        unique: true
    },
    todo: {
        type: String,
        default: '',
        unique: true,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    modifiedOn: {
        type: Date,
        default: Date.now
    },
    completed: {
        type: Boolean
    }

})

module.exports = mongoose.model('todoS', todoModel)