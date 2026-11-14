// routes/webRoutes.js
const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/', productController.getProductsView);
router.get('/products/:id', productController.getProductDetailView);

module.exports = router;
