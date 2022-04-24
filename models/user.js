const mongoose = require('mongoose')
const schema = mongoose.Schema
const { isEmail } = require('validator');
const cryptoJS = require('crypto-js')

const userSchema = new schema({
    firstName : String,
    lastName : String,
    userName : {
        type : String,
        required : [true,"username is required"],
        index : true,
        unique : true,
        trim : true
    },
    email : {
        type : String,
        required : [true,"email is required"],
        lowercase : true,
        unique : true,
        validate: [isEmail, 'Please enter a valid email'],
        trim : true
    },
    password : {
        type : String,
        required : [true,"password is required"],
        minlength : [6,"password must be at least 6 characters"]
    },
    phone : {
        type : String,
        minlength : 11
    },
    address : {
        street : String,
        city : String,
        country : String,
        zipCode : Number
    },isAdmin : {
        type : Boolean,
        default : false
    },
    gender : {
        type: String,
        enum : ['Male','Female']
    },
    createdAt: {
        type : Date,
        default : Date.now(),
        immutable : true
    },
    // updatedAt: {
    //     type : Date,
    //     default : Date.now()
    // }
},{ timestamps: true })

userSchema.statics.login = async function(userName,password) {
    const user = await this.findOne({userName});
    if (user) {
        const hashedPassword = cryptoJS.AES.decrypt(user.password,process.env.password_sec)
        const unHashed = hashedPassword.toString(cryptoJS.enc.Utf8)
        if (unHashed === password){
            return user
        }
        throw Error('invalid password')
    } throw Error('invalid user name')
}

userSchema.path("email").validate( async (email) => {
    const emailCount = await mongoose.models.User.countDocuments({email})
    return !emailCount
}, "Email is already registered")

userSchema.path("userName").validate( async (userName) => {
    const userNameCount = await mongoose.models.User.countDocuments({userName})
    return !userNameCount
}, "UserName is already taken")



User = mongoose.model("User", userSchema);



module.exports = User
