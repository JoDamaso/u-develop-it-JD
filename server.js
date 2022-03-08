// adding our dependencies 
const express = require('express');
// enviorment variable 
const PORT = process.env.PORT || 3001;
// allowing use to create routes using app.
const app = express();
// middle ware 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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