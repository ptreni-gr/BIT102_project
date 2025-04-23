const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve HTML files

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', // Replace with your MySQL root password
    database: 'miz2u_cafe'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected');
});

// Get all discounts
app.get('/api/discounts', (req, res) => {
    db.query('SELECT * FROM discounts', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add new discount
app.post('/api/discounts', (req, res) => {
    const { product_title, discount_percentage } = req.body;

    // Log the request body
    console.log('POST /api/discounts received:', req.body);

    // Validate inputs
    if (!product_title || !discount_percentage || isNaN(discount_percentage) || discount_percentage < 0 || discount_percentage > 100) {
        console.log('Validation failed:', { product_title, discount_percentage });
        return res.status(400).json({ error: 'Invalid product title or discount percentage' });
    }

    const sql = 'INSERT INTO discounts (product_title, discount_percentage) VALUES (?, ?)';
    db.query(sql, [product_title, discount_percentage], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to add discount' });
        }
        console.log('Discount inserted:', { id: result.insertId, product_title, discount_percentage });
        res.json({ id: result.insertId, product_title, discount_percentage });
    });
});

// Delete discount
app.delete('/api/discounts/:id', (req, res) => {
    const sql = 'DELETE FROM discounts WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to delete discount' });
        }
        res.json({ message: 'Discount deleted' });
    });
});

app.get('/api/discounts', (req, res) => {
    db.query('SELECT * FROM discounts', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch discounts' });
        }
        console.log('GET /api/discounts returned:', results);
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});