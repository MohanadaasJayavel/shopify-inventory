const express = require('express');
const { getProducts, updateInventory, getInventoryHistory } = require('../controllers/product.controller');
const router = express.Router();

router.get('/', getProducts);
router.post('/updateinventory', updateInventory);
router.get('/inventoryhistory', getInventoryHistory);

module.exports = router;
