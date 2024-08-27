const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
  id: { type: String},
  order_number: { type: Number },
  user_id: { type: Number }, 
  line_items:{type:Array},
  total_line_items_price :{ type: String},
  total_price :{ type: String},
  total_tax:{ type: String},
  financial_status:{ type: String},
  OrderDetails:{type:Object},
  createdtime: { type: Date},
});

module.exports = mongoose.model("Orders", ordersSchema);
