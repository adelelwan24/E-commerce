const mongoose = require("mongoose")
const Schema = mongoose.Schema

const wishListSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "user",
        required : true,
        unique : true
    },
    products : [{
        type : Schema.Types.ObjectId,
        ref : "product"
    }],

})

module.exports = mongoose.model("Cart", cartSchema)