const Product = require("../models/product.model");
const InventoryHistory = require("../models/inventoryHistory.model");
const shopifyApi = require("../config/shopify.config");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res
      .json({
        data: { message: "Products Fetched Successfully", products: products },
      })
      .status(200);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

exports.updateInventory = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const quantityBefore = product.inventoryQuantity;
    product.inventoryQuantity = quantity;
    product.lastUpdated = Date.now();
    await product.save();

    await shopifyApi.put(`/products/${product.shopifyProductId}.json`, {
      product: {
        id: product.shopifyProductId,
        variants: [{ inventory_quantity: quantity }],
      },
    });
    await InventoryHistory.create({
      productId: product._id,
      changeType: "Manual Adjustment",
      quantityBefore,
      quantityAfter: quantity,
    });

    res.json({ message: "Inventory updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error updating inventory", error });
  }
};

exports.getInventoryHistory = async (req, res) => {
  const { id } = req.params;
  try {
    const history = await InventoryHistory.find({ productId: id }).sort({
      date: -1,
    });
    res.json(history);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching inventory history", error });
  }
};
