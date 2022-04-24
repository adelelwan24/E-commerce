const express = require('express');
const router = express.Router();
const Users = require('../../models/user.js');
const cryptoJS = require("crypto-js")
const {verifyTokenAndAuthorization,verifyTokenAndAdmin} = require("../verifyToken")

// get all users
router.get('/list',verifyTokenAndAdmin , async (request , responce) => {
    const query = request.query.new 
    // await Users.deleteMany({userName : {$ne : "adelelwan24"}})
    try{
        const userList = query ? await Users.find().sort({createdAt : -1}).limit(5) :await Users.find().sort({createdAt: 1});
        responce.status(200).json(userList);
    }
    catch(err){
        responce.status(500).json({Message:'There was an ERROR fetching the data',Error:err});
    }
})

// get user with id 
router.get('/list/:id',verifyTokenAndAuthorization , async (request,responce) => {
    try{
        const user = await Users.findById(request.params.id);
        const {password , ...others} = user._doc
        responce.status(200).json(others);
    }
    catch(err){
        responce.status(500).json({Message:`There was an ERROR fetching the user data with ID :${request.params.id}`,Error:err});
    }
})

// working on 
router.put('/update/:id',verifyTokenAndAuthorization , async (request,responce) => {
    if (request.body.password) {
        request.body.password = cryptoJS.AES.encrypt(
            request.body.password,
            process.env.password_sec)
            .toString()
    }
    try{
        // const updated = await Users.updateOne(
        //     {_id : request.params.id},
        //     {$set: request.body}
        // )
        const updated = await Users.updateOne(
            {_id : request.params.id},
             { $set: {
                email: request.body.email,
                firstName: request.body.firstName,
                lastName : request.body.lastName,
                PhoneNumber: request.body.PhoneNumber,
                isAdmin : request.body.isAdmin,
                password : request.body.password,}},
            {$push : {
                address : request.body.address1,
                address : request.body.address2
            }});
        responce.status(201).json(updated)
    }catch(err){
        responce.status(500).json(
            {Message:`There was an ERROR Updating the user data with ID : ${request.params.id}`,Error:err});
    }
})

router.delete('/delete/:id',verifyTokenAndAuthorization, async (request,responce) => {
    try{
        const removed = await Users.deleteOne({_id : request.params.id});
        responce.status(200).json(removed);
    }catch(err){
        console.log(err.Message)
        responce.status(500).json({Message: "The user hasn't been deleted",Error: err})
    }
})


module.exports = router