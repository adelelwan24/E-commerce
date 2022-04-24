const express = require('express');
const router = express.Router();
const {Cart,CartItem} = require('../../models/cart.js');
const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin}= require("../verifyToken")

router.get('/listcarts',verifyTokenAndAdmin, async (requset, responce) => {
    try{
        const carts = await Cart.find()
        responce.status(200).json(carts)
    }catch(e) {
        responce.status(500).json({ERROR : e})
    }
})

// get cart with user id 
router.get('/user/:id',verifyTokenAndAuthorization , async (request , responce) => {
    try{
        const userCart = await  Cart.findOne({user : request.params.id});
        responce.status(200).json(userCart);
    }
    catch(err){
        responce.status(500).json({Message:'There was an ERROR fetching the data',Error:err});
    }

})

// get cart with cart id 
router.get('/:id',verifyTokenAndAuthorization , async (request , responce) => {
    try{
        const userCart = await  Cart.findOne({user : request.params.id});
        console.log(userCart)
        responce.status(200).json(userCart);
    }
    catch(err){
        responce.status(500).json({Message:'There was an ERROR fetching the data',Error:err});
    }

})

router.get('/:id/items',verifyTokenAndAuthorization , async (request , responce) => {
    try{
        const userCart = await  Cart.findById(request.params.id);
        responce.status(200).json(userCart.products);
    }
    catch(err){
        responce.status(500).json({Message:'There was an ERROR fetching the data',Error:err});
    }

})

router.post('/create',verifyToken, async(request,responce) => {
    try{
        const newCart = new Cart({user : request.body.user});
        await newCart.save()
        responce.status(201).send(`new user was created: ${newCart}`)
    } catch(err) {
        responce.status(500).json({Message: 'There was an ERROR creating the user',Error: err})
    }

})

router.put('/add/:id' , async (request,responce) => {
    try{
        const newItem = new CartItem(
        {
            product: request.body.product,
            quantity : request.body.quantity,
            purchasePrice : request.body.price,
            totalprice : request.body.totalprice,
            status : request.body.status
        })
        const updated = await Cart.updateOne(
            {_id : request.params.id},
             { $push: {
                products : newItem}});
        responce.status(201).json(updated)
    }catch(err){
        responce.status(500).json({Message:`There was an ERROR Adding the item`,Error:err});
    }
})

router.put('/delete/:cartid/:productid' , async (request,responce) => {
    try{
        const updated = await Cart.updateOne(
            {_id : request.params.cartid},
             { $pull: {
                products : {product : request.params.productid}}});
        responce.status(201).json({success : true, Data : updated})
    }catch(err){
        responce.status(500).json({Message:`There was an ERROR Adding the item`,Error:err});
    }
})
router.delete('/:id', async (request,responce) => {
    try{
        const deleted = await Cart.deleteOne({_id : request.body.id})
        responce.status(200).json(deleted)
    }catch(e) {
        responce.status(500).json(e)
    }
})

module.exports = router;