const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  shopifyProductId: { type: String, required: true, unique: true },
  sku: [
    {
      id: { type: Number, required: true },
      barcode: { type: String },
      compare_at_price: { type: String },
      price: { type: String },
      inventory_quantity: { type: Number, required: true },
      // Add other fields as necessary
    },
  ],
  name: { type: String, required: true }, // This should match with the title field from the request
  productDetails: { type: Object }, // To store variant details
  inventoryQuantity: { type: Number, required: true },
  lastUpdated: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
