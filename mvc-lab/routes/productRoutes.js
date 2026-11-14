const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/products', productController.getAllProducts);

router.get('/products/:id', productController.getProductById);

router.get('/products/search/:keyword', productController.searchProducts);

router.post('/products', productController.createProduct);

router.put('/products/:id', productController.updateProduct);

router.delete('/products/:id', productController.softDeleteProduct);

router.put('/products/restore/:id', productController.restoreProduct);

module.exports = router;
