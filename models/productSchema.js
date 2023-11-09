const mongoos = require("mongoose")
const productSchema = new mongoos.Schema({

    title : String,
    discription: String,
    price: Number,
    image: String,
    category: String

})

module.exports = mongoos.model("Product", productSchema)