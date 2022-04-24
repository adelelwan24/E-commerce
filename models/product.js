const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        name: {
            type: String,
            required : true,
            trim: true
        },
        description: {
            type: String,
            required : true,
            trim: true
        },
        categories : {
            type : Array,
            trim : true
        },
        image: String,
        quantity: Number,
        price: {
            type : Number,
            required: true
        },
        size: String,
        color: String
    });

module.exports = mongoose.model('product', productSchema);