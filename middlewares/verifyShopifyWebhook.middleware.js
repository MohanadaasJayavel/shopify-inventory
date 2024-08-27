const crypto = require("crypto");

module.exports = (req, res, next) => {
    try {
      const hmacHeader = req.get("X-Shopify-Hmac-Sha256");
      const body = JSON.stringify(req.body);
      const generatedHash = crypto
        .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
        //   .update(body, "utf8")
        .update(req.body, "utf8", "hex")
        .digest("base64");
      console.log("Body:", body);
      console.log("Generated Hash:", generatedHash);
      console.log("HMAC Header:", hmacHeader);
      if (generatedHash === hmacHeader) {
        return next();
      } else {
        console.error("Verification failed: Hashes do not match");
        return res.status(401).json({ message: "Webhook verification failed" });
      }
    } catch (error) {
      console.error("Error verifying Shopify webhook:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
};
