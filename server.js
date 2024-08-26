const express = require("express");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
const productRoutes = require("./routes/product.routes");
const webhookRoutes = require("./routes/webhook.routes");
const { connectToDatabase } = require("./config/database.config");
const crypto = require("crypto");
const port = 3000;
app.use(express.json());
dotenv.config();
app.use("/api/products", productRoutes);
app.use("/api/webhook", webhookRoutes);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  connectToDatabase();
});
