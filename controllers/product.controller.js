const Product = require("../models/product.model");
const InventoryHistory = require("../models/inventoryHistory.model");
const axios = require("axios")

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
  const { productId, variantId, inventoryQuantity } = req.body;
  try {
    const product = await Product.findOne({ shopifyProductId: productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      let changes = {}
      for (let i = 0; i < product.productVariants.length; i++) {
        if (product.productVariants[i].id === variantId) {
          let changes = {
            inventory_quantity: {
              old: product.productVariants[i].inventory_quantity,
              new: inventoryQuantity
            },
            old_inventory_quantity: {
              old: product.productVariants[i].old_inventory_quantity,
              new: inventoryQuantity
            }
          };
          product.productVariants[i].inventory_quantity = inventoryQuantity
          product.productVariants[i].old_inventory_quantity = inventoryQuantity
          product.markModified('productVariants');
          let UpdatedInventoryReponse = await product.save();
          await InventoryHistory.create({
            productId: productId,
            variantId: variantId,
            changes,
            timestamp: new Date(),
            action: 'Manual inventory update'
          });
          let ShopifyUpdateResponse = await updateShopifyInventory(variantId, inventoryQuantity)
          console.log("ShopifyUpdateResponse--->", ShopifyUpdateResponse)
        } else {
          console.log("variant not found", product.productVariants[i].id, variantId)
        }
      }
    }
    res.status(201).json({ message: "Inventory updated successfully", UpdatedInventoryReponse });
  } catch (error) {
    res.status(500).json({ message: "Error updating inventory", error });
  }
};

exports.getInventoryHistory = async (req, res) => {
  const { productId } = req.body;
  try {
    const query = productId ? { productId } : {};
    const history = await InventoryHistory.find(query).sort({
      date: -1,
    });
    console.log("history--->",history)
    if(history.length){
      res.json({data:history,message:"Successfully fetched records"}).status(200);
    }else{
      res.json({message:"No records found"}).status(200);

    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching inventory history", error });
  }
};

async function updateShopifyInventory(inventoryItemId, available) {
  const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  const shopifyStoreName = process.env.SHOPIFY_STORE;
  let locationId = process.env.SHOPIFY_LOCATION_ID

  try {
    const response = await axios.post(
      `https://${shopifyStoreName}.myshopify.com/admin/api/2024-07/inventory_levels/set.json`,
      {
        location_id: locationId,
        inventory_item_id: inventoryItemId,
        available: available
      },
      {
        headers: {
          'X-Shopify-Access-Token': shopifyAccessToken,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Inventory updated successfully:', response.data);
    return response.data
  } catch (error) {
    console.error('Error updating inventory:', error.response.data);
    throw new Error(error)
  }
}