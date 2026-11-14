const Product = require('../models/productModel');

const productController = {
  // Get all products
  getAllProducts: (req, res) => {
    Product.getAll((err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  // Get product by ID
  getProductById: (req, res) => {
    Product.getById(req.params.id, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results[0] || {});
    });
  },

  // Search product by keyword
  searchProducts: (req, res) => {
    const { keyword } = req.params;
    Product.searchByKeyword(keyword, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  // Create product
  createProduct: (req, res) => {
    const { name, price } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ error: 'name and price are required' });
    }

    Product.create(req.body, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: 'Product created',
      });
    });
  },

  // Update product
  updateProduct: (req, res) => {
    const { id } = req.params;
    Product.update(id, req.body, err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product updated' });
    });
  },

  // Soft delete product
  softDeleteProduct: (req, res) => {
    const { id } = req.params;
    Product.softDelete(id, err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product soft-deleted' });
    });
  },

  // Restore product
  restoreProduct: (req, res) => {
    const { id } = req.params;
    Product.restore(id, err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product restored' });
    });
  },

  // Add views for products
  getProductsView: (req, res) => {
    Product.getAll((err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.render('products', { products: results }); // ส่งผลลัพธ์ไปยัง view
    });
  },
};

module.exports = productController;
