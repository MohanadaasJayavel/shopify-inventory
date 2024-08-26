const Product = require("../models/product.model");
const InventoryHistory = require("../models/inventoryHistory.model");

const handleWebhook = async (req, res) => {
  const { id, title, variants } = req.body.product;

  try {
    const product = await Product.findOne({ shopifyProductId: id });
    const quantityBefore = product ? product.inventoryQuantity : 0;
    const quantityAfter = variants[0].inventory_quantity;

    if (product) {
      product.inventoryQuantity = quantityAfter;
      product.lastUpdated = Date.now();
      await product.save();
    } else {
      await Product.create({
        shopifyProductId: id,
        sku: variants[0].sku,
        name: title,
        inventoryQuantity: quantityAfter,
      });
    }

    await InventoryHistory.create({
      productId: product ? product._id : id,
      changeType: "Webhook Update",
      quantityBefore,
      quantityAfter,
    });

    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error processing webhook", error });
  }
};
const createOrders = async (req, res) => {
  const { id, title, variants } = req.body.product;

  try {
    const product = await Product.findOne({ shopifyProductId: id });
    if (product) {
      await product.save();
    } else {
      await Product.create({
        shopifyProductId: id,
        sku: variants[0].sku,
        name: title,
        inventoryQuantity: quantityAfter,
      });
    }
    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error processing webhook", error });
  }
};
const editProduct = async (req, res) => {
  try {
    const { id, sku, inventory_quantity } = req.body;
    let product = await Product.findOne({ shopifyProductId: id });
    if (!product) {
      product = new Product({
        shopifyProductId: id,
        title: req.body.product.title,
        sku,
        inventoryQuantity: inventory_quantity,
      });
    } else {
      product.inventoryQuantity = inventory_quantity;
    }
    console.log("product------>", product);
    await product.save();

    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.status(400).json({ message: "Unable to update product" });
  }
};
module.exports = { handleWebhook, createOrders, editProduct };
