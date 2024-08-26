const axios = require("axios");

const shopifyApi = axios.create({
  baseURL: `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-07`,
  headers: {
    "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
    "Content-Type": "application/json",
  },
});

module.exports = shopifyApi;
