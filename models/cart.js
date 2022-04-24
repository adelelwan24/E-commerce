const mongoose = require("mongoose")
const Schema = mongoose.Schema

const cartSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "user",
        required : true,
        unique : true
    },
    products : [],

})

module.exports = mongoose.model("Cart", cartSchema)