

The Shopify Inventory System is a comprehensive application designed to manage and synchronize inventory data between a Shopify store and a local database. This application provides essential features for effective inventory management, including data retrieval, real-time updates, manual adjustments, and historical logging.

Key Features
1. Inventory Data Retrieval
2. Real-Time Inventory Updates via Webhooks
3. Manual Inventory Adjustment
4. Inventory History Logging
5. Application Structure

The application is organized into two primary types of routes:

    * Webhook Routes: Handles real-time updates from Shopify.
    * Product Routes: Manages product data and inventory adjustments.


Webhook Routes
The webhook routes handle real-time data synchronization with Shopify:

1. Create Order - /api/webhook/createorder (POST)
    * Captures order creation events from Shopify.
    * Updates the local database and maintains inventory records.
    * Creates history logs for inventory control.


2. Edit Product - /api/webhook/editproduct (POST)
    * Captures updates to products and variants in Shopify.
    * Updates the local database and stores changes in the inventory history.
    * Webhooks are secured using HMAC-SHA256 verification with Shopify's secret key, included in the webhook headers.

Product Routes
The product routes manage inventory data and adjustments:

1. GET All Products - /api/products
    * Retrieves all products from the local database.

2. Inventory History - /api/products/getInventoryHistory
    * Displays real-time updates and changes to product inventory.
    * Stores and organizes data to review changes and actions.

3. Manual Inventory Adjustment - /api/products/updateInventory
    * Manually adjusts inventory levels in the local database.
    * Updates the corresponding Shopify location inventory based on provided location ID, variant ID, and adjustment count.
    * Tracks manual adjustments in the inventory history.