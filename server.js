const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', // Replace with your MySQL root password
    database: 'miz2u_cafe'
});

db.connect(err => {
    if (err) {
        console.error('MySQL connection failed:', err);
        return;
    }
    console.log('MySQL connected');
});

// POST /api/discounts - Create a new discount
app.post('/api/discounts', (req, res) => {
    const { product_title, discount_percentage } = req.body;

    console.log('Received POST request:', { product_title, discount_percentage });

    if (!product_title || product_title.trim() === '') {
        console.log('Validation failed: Invalid product title');
        return res.status(400).json({ error: 'Product title is required and cannot be empty' });
    }
    if (discount_percentage === null || discount_percentage === undefined || isNaN(discount_percentage)) {
        console.log('Validation failed: Invalid discount percentage');
        return res.status(400).json({ error: 'Discount percentage is required and must be a number' });
    }
    if (discount_percentage < 0) {
        console.log('Validation failed: Negative discount percentage');
        return res.status(400).json({ error: 'Discount percentage cannot be negative' });
    }
    if (discount_percentage > 100) {
        console.log('Validation failed: Discount percentage exceeds 100');
        return res.status(400).json({ error: 'Discount percentage cannot exceed 100%' });
    }

    const normalizedTitle = product_title.trim();

    const checkQuery = 'SELECT id, product_title FROM discounts WHERE product_title = ?';
    db.query(checkQuery, [normalizedTitle], (err, results) => {
        if (err) {
            console.error('Error checking for duplicate:', err);
            return res.status(500).json({ error: 'Database error during duplicate check' });
        }

        console.log('Duplicate check results:', results);

        if (results.length > 0) {
            console.log(`Duplicate found for product_title: ${normalizedTitle}`);
            return res.status(400).json({ error: `Discount for "${product_title}" already exists` });
        }

        const insertQuery = 'INSERT INTO discounts (product_title, discount_percentage) VALUES (?, ?)';
        db.query(insertQuery, [normalizedTitle, parseFloat(discount_percentage)], (err, result) => {
            if (err) {
                console.error('Error inserting discount:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log(`UNIQUE constraint caught duplicate: ${normalizedTitle}`);
                    return res.status(400).json({ error: `Discount for "${product_title}" already exists` });
                }
                return res.status(500).json({ error: `Failed to add discount: ${err.message}` });
            }

            console.log('Discount added:', { id: result.insertId, product_title, discount_percentage });
            res.status(201).json({
                id: result.insertId,
                product_title,
                discount_percentage: parseFloat(discount_percentage)
            });
        });
    });
});

// GET /api/discounts - Read all discounts
app.get('/api/discounts', (req, res) => {
    console.log('Received GET request for /api/discounts');
    db.query('SELECT * FROM discounts', (err, results) => {
        if (err) {
            console.error('Error fetching discounts:', err);
            return res.status(500).json({ error: `Database error: ${err.message}` });
        }
        console.log('Discounts fetched:', results);
        res.json(results);
    });
});

// PUT /api/discounts/:id - Update a discount
app.put('/api/discounts/:id', (req, res) => {
    const { id } = req.params;
    const { product_title, discount_percentage } = req.body;

    console.log('Received PUT request:', { id, product_title, discount_percentage });

    if (!product_title || product_title.trim() === '') {
        console.log('Validation failed: Invalid product title');
        return res.status(400).json({ error: 'Product title is required and cannot be empty' });
    }
    if (discount_percentage === null || discount_percentage === undefined || isNaN(discount_percentage)) {
        console.log('Validation failed: Invalid discount percentage');
        return res.status(400).json({ error: 'Discount percentage is required and must be a number' });
    }
    if (discount_percentage < 0) {
        console.log('Validation failed: Negative discount percentage');
        return res.status(400).json({ error: 'Discount percentage cannot be negative' });
    }
    if (discount_percentage > 100) {
        console.log('Validation failed: Discount percentage exceeds 100');
        return res.status(400).json({ error: 'Discount percentage cannot exceed 100%' });
    }

    const normalizedTitle = product_title.trim();

    const checkQuery = 'SELECT id, product_title FROM discounts WHERE product_title = ? AND id != ?';
    db.query(checkQuery, [normalizedTitle, id], (err, results) => {
        if (err) {
            console.error('Error checking for duplicate:', err);
            return res.status(500).json({ error: 'Database error during duplicate check' });
        }

        if (results.length > 0) {
            console.log(`Duplicate found for product_title: ${normalizedTitle}`);
            return res.status(400).json({ error: `Discount for "${product_title}" already exists` });
        }

        const updateQuery = 'UPDATE discounts SET product_title = ?, discount_percentage = ? WHERE id = ?';
        db.query(updateQuery, [normalizedTitle, parseFloat(discount_percentage), id], (err, result) => {
            if (err) {
                console.error('Error updating discount:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log(`UNIQUE constraint caught duplicate: ${normalizedTitle}`);
                    return res.status(400).json({ error: `Discount for "${product_title}" already exists` });
                }
                return res.status(500).json({ error: `Failed to update discount: ${err.message}` });
            }
            if (result.affectedRows === 0) {
                console.log(`No discount found with id: ${id}`);
                return res.status(404).json({ error: 'Discount not found' });
            }

            console.log('Discount updated:', { id, product_title, discount_percentage });
            res.json({ id, product_title, discount_percentage: parseFloat(discount_percentage) });
        });
    });
});

// DELETE /api/discounts/:id - Delete a discount
app.delete('/api/discounts/:id', (req, res) => {
    const { id } = req.params;
    console.log('Received DELETE request for ID:', id);
    db.query('DELETE FROM discounts WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting discount:', err);
            return res.status(500).json({ error: `Failed to delete discount: ${err.message}` });
        }
        if (result.affectedRows === 0) {
            console.log(`No discount found with id: ${id}`);
            return res.status(404).json({ error: 'Discount not found' });
        }
        console.log('Discount deleted:', id);
        res.json({ message: 'Discount deleted' });
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
