const express = require('express');
const router = express.Router();
const Users = require('../../models/user.js');
const cryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken");
const res = require('express/lib/response');

function creatJWToken(id,isAdmin) {
    return jwt.sign({
        id: id,
        isAdmin : isAdmin},
        process.env.jwt_sec,
        {expiresIn:"2d"}
    )
}

function errorHandller(err) {
    console.log(err.message, err.code)
    let errors = {}
    if (err.message.includes("User validation failed"))
    {
        Object.values(err.errors).forEach(({properties}) => {
            console.log(properties)
            errors[properties.path] = properties.message
        })
    }
    if (err.message === "invalid password") {
        errors.password = "This password is invalid"
    }
    if (err.message === 'invalid user name') {
        errors.userName = "This user name is invalid"
    }

    return errors
}

router.post('/register' , async(request,responce) => {
    try{
        const data = {
            userName: request.body.userName,
            email: request.body.email,
            firstName: request.body.firstName,
            lastName : request.body.lastName,
            phone: request.body.phone,
            isAdmin : request.body.isAdmin,
            password : cryptoJS.AES.encrypt(request.body.password,process.env.password_sec).toString(),
            // address : [request.body.address1,request.body.address2]
            address : request.body.address
        }
        const newUser = new Users(data);
        await newUser.save()

        // creating access token
        const accessToken = creatJWToken(newUser._id,newUser.isAdmin)
        responce.cookie('jwt', accessToken, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 2})
        responce.status(201).json({Message : `new user was created:`,user: newUser})
    } catch(err) {
        errors = errorHandller(err)
        console.log(errors)
        responce.status(500).json({Message: 'There was an ERROR creating the user',Error: errors})
    }
})

router.post('/login' , async(request,responce) => {
    const name = request.body.userName
    const pass = request.body.password
    try{
    //     const user = await Users.findOne({userName: request.body.userName})
    //     if (!user){
    //     responce.status(401).json({UserError : 'Invalid user name'})
    //     }else {
    //     const hashedPassword = cryptoJS.AES.decrypt(user.password,process.env.password_sec)
    //     const unHashed = hashedPassword.toString(cryptoJS.enc.Utf8)
    //     if (unHashed !== request.body.password){
    //     responce.status(401).json({passwordError : 'Invalid password'})
    //     }else {
    //     const {password, ...others} = user._doc

    //     // creating access token
    //     const accessToken = creatJWToken(user._id,user.isAdmin)
    //     responce.cookie('jwt', accessToken, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 2})
    //     responce.status(200).json({success : true, Data: {...others,accessToken}})
    // }}
    const user = await Users.login(name,pass)
    console.log(user)
    const {password, ...others} = user._doc
    const accessToken = creatJWToken(user._id,user.isAdmin)
    responce.cookie('jwt', accessToken, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 2})
    responce.status(200).json({success : true, Data: {...others,accessToken}})
    } catch(err) {
        errors = errorHandller(err)
        responce.status(500).json({Message: 'There was an ERROR logging in',Error: errors})
    }
})

router.get('/logout',(request,responce) => {
    responce.cookie("jwt",'',{maxAge : 1})
    responce.redirect("/")
})

module.exports = router;
