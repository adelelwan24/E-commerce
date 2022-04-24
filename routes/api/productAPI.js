const express = require('express');
const router = express.Router();
const Products = require('../../models/product.js');
const {verifyTokenAndAdmin} = require("../verifyToken")


router.get("/list", async (request,responce) => {
    const newQ = request.query.new
    const category = request.query.category
    try{
        let productList
        if (newQ && category) {
            productList = await Products
            .find({categories : {$in : category}})
            .sort({createdAt: -1})
            .limit(5);
        }else if (newQ) {
            productList = await Products.find().sort({_id: -1}).limit(5);
        }else if (category) {
            productList = await Products.find({categories : {$in : category}})
        }else {
            productList = await Products.find()
        }
        responce.status(200).json(productList)
    }catch(err) {
        responce.status(400).json({Message: 'there was an ERROR fetching the products', Error: err})
    }
});

router.get('/list/:id' , async (request,responce) => {
    try{
        const product = await Products.findById(request.params.id);
        responce.status(200).json(product);
    }
    catch(err){
        responce.status(400).json({Message:`There was an ERROR fetching the product data with ID :${request.params.id}`,Error:err});
    }
})

router.post("/create",verifyTokenAndAdmin , async (request,responce) => {
    try{
        const newProduct = new Products( request.body)
        // const newProduct = new Products(
        // {   name: request.body.name,
        //     description : request.body.description,
        //     image : request.body.image,
        //     quantity : request.body.quantity,
        //     price : request.body.price,
        //     size : request.body.size,
        //     color : request.body.color
        // });
        await newProduct.save()
        responce.status(201).json(newProduct)
    }catch(err){
        responce.status(500).json({Message: 'there was an ERROR adding  the product', Error: err})
    }
})


router.put('/update/:id',verifyTokenAndAdmin , async (request,responce) => {
    try{
        const updated = await Products.updateOne(
            {_id : request.params.id},
             { $set: {
                name: request.body.name,
                description : request.body.description,
                image : request.body.image,
                quantity : request.body.quantity,
                price : request.body.price,
                size : request.body.size,
                color : request.body.color}});
        responce.status(201).json(updated)
    }catch(err){
        responce.status(500).json({Message:`There was an ERROR Updating the user data with ID : ${request.params.id}`,Error:err});
    }
})

router.delete('/delete/:id', verifyTokenAndAdmin,async (request,responce) => {
    try{
        const removed = await Products.deleteOne({_id : request.params.id});
        responce.status(200).json(removed);
    }catch(err){
        responce.status(500).json({Message: "The product hasn't been deleted",Error: err})
    }
})

module.exports = router