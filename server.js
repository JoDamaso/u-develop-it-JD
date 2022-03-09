// adding our dependencies 
const express = require('express');
const inputCheck = require('./utils/inputCheck');
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

// GET all candidates
app.get('/api/candidates', (req, res) => {
    // return all data from 'candidates' table
    const sql = `SELECT * FROM candidates`;

    db.query(sql, (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return
        }
        res.json({
            // if no error from the database, will respond with json and success while showing the 'row' they searched
            message: 'success!',
            data: row
        });
    });
});

// GET a single candidate with id
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id]
    //database 
    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ 
            // shows it was a success and not a user error(400)
            message: 'success!',
            data: row
        });
    });
});

// DELETE a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id =?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
        } 
        else if (!result.affectedRows) {
            // if client searched a non existent person with 'id' 
            // if you try and delete the candidate with the same 'id' you will also get this message
            res.json({
                message: 'Candidate not found'
            });
        }
        else {
            // if no error or non-exsistent 'id' display they were deleted by showing the rows and 'id" deleted
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// Create a candidate with POST to insert into the TABLE
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        // errors makes sure that the client inputs all the data needed
        // to lighten our calls to the database, we pass this error to the user
        res.status(400).json({ error: errors });
        return;
    }
    // inserting into TABLE Candidates
    // since newly created candidate, MySQL will give a unique 'id' to the candidate 
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
            VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    // query that will create and send back to user the info
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
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