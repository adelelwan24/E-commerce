const mongoose = require('mongoose')
const run = require('nodemon/lib/monitor/run');
const { stringify } = require('nodemon/lib/utils');
const schema = mongoose.Schema

const userSchema = schema({
    name : {
        type : String,
        required : true,
        uniqe : true
    },
    email : {
        type : String,
        required : true,
        lowercase : true,
        uniqe : true
    },
    password : {
        type : String,
        required : true,
        min : 6
    },
    phoneNumber : {
        type : String,
        length : 11
    },
    address : {
        street : String,
        city : String,
        country : String,
        zipCode : Number
    },
    createdAt: {
        type : Date,
        default : Date.now(),
        immutable : true
    },
    updatedAt: {
        type : Date,
        default : Date.now()
    }
})

User = mongoose.model("User", userSchema);
module.exports = User
