const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// GET all candidates
router.get('/candidates', (req, res) => {
    // return all data from 'candidates' table
    // also returns parties table, which JOINS them together
    const sql = `SELECT candidates.*, parties.name AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id`;

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
router.get('/candidate/:id', (req, res) => {
    // selects the candidate with an 'id' input to the api
    // also joins the tables to show the id with party joined
    const sql = `SELECT candidates.*, parties.name AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id
                WHERE candidates.id = ?`;

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

// Create a candidate with POST to insert into the TABLE
router.post('/candidate', ({ body }, res) => {
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

//UPDATE a candidate's party with PUT
router.put('/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');
    if (errors) {
        res.status(400).json({ error: errors });
    }

    const sql = `UPDATE candidates SET party_id = ? 
                WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
        res.status(400).json({ error: err.message });
        // check if a record was found
        } else if (!result.affectedRows) {
        res.json({
            message: 'Candidate not found'
        });
        } else {
        res.json({
            message: 'success',
            data: req.body,
            changes: result.affectedRows
        });
        }
    });
});

// DELETE a candidate by 'id'
router.delete('/candidate/:id', (req, res) => {
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

module.exports = router;