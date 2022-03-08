// adding our dependencies 
const express = require('express');
const mysql = require('mysql2');
// enviorment variable 
const PORT = process.env.PORT || 3001;
// allowing use to create routes using app.
const app = express();
// middle ware 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
    host: 'localhost',
    // YOur MySQL username,
    user: 'root',
    // Your MySQL password,
    password: 'Mustang2015!',
    database: 'election'
    },
    console.log('Connected to the election database.')
);

// return all data from 'candidates' table
db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows)
});

//GET routes
app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

// Default response for any other request (Not Found)
// make sure the status is one of the last ones for GET
app.use((req, res) => {
    res.status(404).end();
});





// listen always goes LAST
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});