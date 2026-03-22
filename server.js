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
    password: '', // If you have a password for MySQL, put it here
    database: 'task_db'
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

const PORT = 5000;
app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
});