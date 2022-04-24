const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        cart: {
            type: Schema.Types.ObjectId,
            ref: 'cart'
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required : true
        },
        total: {
            type: Number,
            default: 0
        },address :{ 
            type : {
            street : String,
            city : String,
            country : String},
            required: true
        },status : {
            type : String ,
            default : 'Pending ',
            enum : ["Pending", "Shipped","Delivered","Cancelled"]}
    },
    { timestamps: true }
);

module.exports = mongoose.model('order', OrderSchema);