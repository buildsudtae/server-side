const express = require('express');
const router = express.Router();

const db = require('../configs/db');

// Get all products
router.get('/products', (req, res) => {
  db.query('SELECT * FROM products WHERE is_deleted = 0', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get product by ID
router.get('/products/:id', (req, res) => {
  db.query('SELECT * FROM products WHERE id = ? AND is_deleted = 0', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || {});
  });
});

// Soft delete product
router.delete('/products/:id', (req, res) => {
  db.query('UPDATE products SET is_deleted = 1 WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product soft-deleted' });
  });
});

module.exports = router;
