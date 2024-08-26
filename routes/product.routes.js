const express = require('express');
const { getProducts, updateInventory, getInventoryHistory } = require('../controllers/product.controller');
const router = express.Router();

router.get('/', getProducts);
router.post('/:id/inventory', updateInventory);
router.get('/:id/history', getInventoryHistory);

module.exports = router;
