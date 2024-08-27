const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  shopifyProductId: { type: String},
  name: { type: String},
  productVariants: { type: Array }, 
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
