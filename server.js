const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 1. MySQL Connection Configuration
// Replace these with your actual MySQL Workbench credentials
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Your MySQL username
    password: process.env.DB_PASSWORD, // Your MySQL password
    database: 'luxe_skincare'  // The database we created
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to the Luxe Skincare MySQL Database!');
});

// 2. GET Route: Fetch all products for the Shop
app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).send('Server Error');
        } else {
            res.json(results);
        }
    });
});

// 3. POST Route: Save a new order when "Confirm & Pay" is clicked
app.post('/api/orders', (req, res) => {
    // 1. Destructure all 4 pieces of data from the request body
    const { username, product_name, fullName, email } = req.body;

    // 2. Update your SQL query to include the 2 new columns
    const query = 'INSERT INTO orders (username, product_name, full_name, email) VALUES (?, ?, ?, ?)';

    // 3. Pass all 4 values into the query
    db.query(query, [username, product_name, fullName, email], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving order');
        } else {
            res.status(200).send('Order saved successfully');
            // 1. Setup the "Post Office" (using Gmail as an example)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your business email
        pass: process.env.EMAIL_PASS  // Your App Password (not your regular login)
    }
});

// 2. Draft the Email
const mailOptions = {
    from: 'Luxe Skincare <your-email@gmail.com>',
    to: email, // This is the email variable from your checkout form
    subject: 'Order Confirmed - Luxe Skincare',
    text: `Hi ${full_name}, thank you for ordering the ${product_name}! We are preparing your glow.`
};

// 3. Send it!
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log("Email failed:", error);
    } else {
        console.log("Email sent: " + info.response);
    }
});
        }
    });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});