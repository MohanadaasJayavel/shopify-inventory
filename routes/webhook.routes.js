const express = require("express");
const {
  handleWebhook,
  createOrders,
  editProduct,
} = require("../controllers/webhook.contoller");
const verifyShopifyWebhook = require("../middlewares/verifyShopifyWebhook.middleware");
const router = express.Router();

// router.post("/", verifyShopifyWebhook, handleWebhook);
router.post("/createorder", createOrders);
router.post("/editproduct", editProduct);

module.exports = router;
