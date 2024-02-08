var express = require('express');
var router = express.Router();

const db = require('../../database')
const {response} = require("express");

router.get('/', function(req, res, next) {
    console.log("borrower");
    res.render('', { title: 'borrower-main' });
    res.json("main borrower page");
    console.log("borrower");
});

router.get('/show-borrowers', async (req, res) => {
    try {
        const rows = await db.query("SELECT * FROM borrower");
        res.render('borrowers', { borrowers: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/register-borrower', function(req, res, next) {
    res.render('form/register-borrower');
});

router.post('/register-borrower', async (req, res) => {
    var name = req.body.borrower_name;
    var email = req.body.borrower_email;
    var registered_date = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format the date

    var query = `INSERT INTO Borrower (name, email, registered_date) VALUES ("${name}", "${email}", "${registered_date}")`;

    try {
        const data = await db.query(query);
        res.json({ message: "borrower registered successfully." });
    } catch (err) {
        console.error("Error registering borrower:", err);
        res.status(500).json({ error: "An error occurred while registering the borrower." });
    }
});

router.get('/update-borrower', async (req, res) => {
    const { id } = req.query;

    try {
        // Fetch the book details from the database using the ID
        const [borrower] = await db.query('SELECT * FROM borrower WHERE id = ?', [id]);

        // Render the update-book view with the book details
        res.render('update-borrower', { borrower }); // Assuming the book is returned as an array
    } catch (error) {
        console.error("Error fetching borrower details:", error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/update', async (req, res) => {
    const { id, borrower_name, borrower_email, registered_date } = req.body;

    try {
        // Update the book details in the database
        await db.query('UPDATE borrower SET name=?, email=? WHERE id=?', [borrower_name, borrower_email, id]);
        res.redirect('/borrower/show-borrowers'); // Redirect back to the show-borrowers page after updating
    } catch (error) {
        console.error("Error updating borrower:", error);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/delete-borrower', async (req, res) => {
    const { id } = req.query;

    try {
        // Delete the borrower from the database using the ID
        await db.query('DELETE FROM borrower WHERE id = ?', [id]);
        res.sendStatus(204); // Send a 204 No Content response if successful
    } catch (error) {
        console.error("Error deleting borrower:", error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;