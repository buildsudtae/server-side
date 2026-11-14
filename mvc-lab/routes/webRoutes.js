// routes/webRoutes.js
const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/', productController.getProductsView);

module.exports = router;
