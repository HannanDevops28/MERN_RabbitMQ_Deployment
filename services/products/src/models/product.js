const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: {
    type: Number,
    default: 10 // default stock for demo
  }
});

module.exports = mongoose.model("Product", productSchema);
