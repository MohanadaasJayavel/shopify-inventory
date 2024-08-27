const mongoose = require("mongoose");

const InventoryHistory = new mongoose.Schema({
  productId: { type: String },
  variantId: { type: String },
  changes: { type: Object },
  timestamp: { type: Date, default: Date.now },
  action: { type: String}
});

module.exports = mongoose.model("InventoryHistory", InventoryHistory);
