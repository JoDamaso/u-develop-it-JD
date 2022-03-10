// adding our dependencies 
const express = require('express');
// requiring the connection
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');

// enviorment variable 
const PORT = process.env.PORT || 3001;
// allowing use to create routes using app.
const app = express();
// middle ware 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// use apiRoutes
app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
// make sure the status is one of the last ones for GET
app.use((req, res) => {
    res.status(404).end();
});

// app.listen is always last
db.connect(err => {
    if (err) throw err;
    console.log('Database connected');
    app.listen(PORT, () => {
        console.log(`SERVER RUNNING ON PORT: ${PORT}`);
    });
});
