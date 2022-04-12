const express = require('express');
const router = express.Router();

const CartItems = require('../../models/cartitem.js');

router.use(express.json())


router.get("/", async (request,responce) => {
    try{
        const items = await CartItems.find()
        responce.status(200).json(items)
    }catch(err) {
        responce.status(400).json({Message: 'there was an ERROR fetching the products', Error: err})
    }
});

router.get('/list/:id' , async (request,responce) => {
    try{
        const product = await CartItems.findById(request.params.id);
        responce.status(200).json(product);
    }
    catch(err){
        responce.status(400).json({Message:`There was an ERROR fetching the product data with ID :${request.params.id}`,Error:err});
    }
})

router.post("/create" , async (request,responce) => {
    try{
        const newProduct = new CartItems(
        {   name: request.body.name,
            description : request.body.description,
            image : request.body.image,
            quantity : request.body.quantity,
            price : request.body.price,
            size : request.body.size,
            color : request.body.color
        });
        await newProduct.save()
        responce.status(201).json(newProduct)
    }catch(err){
        responce.status(500).json({Message: 'there was an ERROR adding  the product', Error: err})
    }
})


router.put('/update/:id' , async (request,responce) => {
    try{
        const updated = await CartItems.updateOne(
            {_id : request.params.id},
             { $set: {
                product: request.body.product,
                quantity : request.body.quantity,
                purchasePrice : request.body.price,
                totalprice : request.body.totalprice,
                status : request.body.status}});
        responce.status(201).json(updated)
    }catch(err){
        responce.status(500).json({Message:`There was an ERROR Updating the user data with ID : ${request.params.id}`,Error:err});
    }
})

router.delete('/delete/:id', async (request,responce) => {
    try{
        const removed = await CartItems.deleteOne({_id : request.params.id});
        responce.status(200).json(removed);
    }catch(err){
        responce.status(500).json({Message: "The product hasn't been deleted",Error: err})
    }
})


module.exports = router