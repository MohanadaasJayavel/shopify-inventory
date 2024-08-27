const Product = require("../models/product.model");
const InventoryHistory = require("../models/inventoryHistory.model");
const ordersSchema = require("../models/orders.model")
const { formToJSON } = require("axios");

const createOrders = async (req, res) => {
  let data = req.body
  try {
    let { id, user_id, order_number, line_items, total_line_items_price, total_tax, total_price, financial_status, created_at } = data
    let orderCreationResponse = await ordersSchema.create({
      id,
      user_id,
      order_number,
      line_items,
      total_line_items_price,
      total_tax,
      total_price,
      financial_status,
      createdtime: created_at,
      OrderDetails: data
    });
    if (orderCreationResponse) {
      for (let item of line_items) {
        let productId = item.product_id;
        let variantId = item.variant_id;
        let quantityOrdered = item.quantity;
        let product = await Product.findOne({ shopifyProductId: productId });
        if (product) {
          let variant = product.productVariants.find(v => v.id === variantId);
          if (variant) {
            let oldQuantity = variant.inventory_quantity;
            variant.inventory_quantity = quantityOrdered;
            variant.old_inventory_quantity = quantityOrdered;
            await Product.updateOne(
              { shopifyProductId: productId, 'productVariants.id': variantId },
              { $set: { 'productVariants.$.inventory_quantity': variant.inventory_quantity, 'productVariants.$.old_inventory_quantity': variant.old_inventory_quantity } }
            );
  
            await InventoryHistory.create({
              productId: product.shopifyProductId,
              variantId: variantId,
              changes: {
                oldQuantity,
                newQuantity: variant.inventory_quantity,
                quantityOrdered
              },
              timestamp: new Date(),
              action: 'Order placed'
            });
          }
        }
      }
    }
    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error processing webhook", error });
  }
};
const editProduct = async (req, res) => {
  try {
    const data = req.body;
    let product = await Product.findOne({ shopifyProductId: data.id });
    if (!product) {
      let variantsDetails = []
      for (let i = 0; i < data.variants.length; i++) {
        let { id, inventory_quantity, old_inventory_quantity, sku, price, compare_at_price, created_at, updated_at } = data.variants[i]
        variantsDetails.push({ id, inventory_quantity, old_inventory_quantity, sku, price, compare_at_price, created_at, updated_at })
      }
      product = new Product({
        shopifyProductId: data.id,
        name: data.title,
        productVariants: variantsDetails
      });
      await product.save();
    } else {
      let dbVariants = product.productVariants;
      let dataVariants = data.variants;

      for (let i = 0; i < dataVariants.length; i++) {
        let dataVariant = dataVariants[i];
        let dbVariant = dbVariants.find(variant => variant.id === dataVariant.id);

        if (dbVariant) {
          let differences = {};
          for (const key in dbVariant) {
            if (dataVariant.hasOwnProperty(key) && dbVariant[key] !== dataVariant[key]) {
              differences[key] = {
                oldValue: dbVariant[key],
                newValue: dataVariant[key]
              };
            }
          }
          if (Object.keys(differences).length > 0) {
            console.log(`Differences found for variant with ID ${dbVariant.id}:`, differences);
            for (const key in differences) {
              dbVariant[key] = differences[key].newValue;
            }

            await InventoryHistory.create({
              productId: product.shopifyProductId,
              variantId: dbVariant.id,
              changes: differences,
              timestamp: new Date(),
              action:"Product Variant Updated"
            })
          }
        } else {
          let { id, inventory_quantity, old_inventory_quantity, sku, price, compare_at_price, created_at, updated_at } = dataVariant;
          dbVariants.push({ id, inventory_quantity, old_inventory_quantity, sku, price, compare_at_price, created_at, updated_at });

          await InventoryHistory.create({
            productId: product.shopifyProductId,
            variantId: dbVariant.id,
            changes: differences,
            timestamp: new Date(),
            action:"Product Variant Created"
          })
        }
      }
      product.productVariants = dbVariants;
      await product.save();
    }
    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.status(400).json({ message: "Unable to update product" });
  }
};
module.exports = { createOrders, editProduct };
