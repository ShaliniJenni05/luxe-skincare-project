const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection Setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'skincare_products'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL Database!');
});

// A simple test route
app.get('/', (req, res) => {
    res.send('Your backend server is running!');
});
app.get('/get-products', (req, res) => {
    const sql = "SELECT * FROM skincare_products"; // This pulls data from your new table
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send(err);
        }
        res.json(results); // Sends the list of products back to your website
    });
});
const PORT = 5000;
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});
