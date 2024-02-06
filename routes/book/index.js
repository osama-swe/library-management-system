var express = require('express');
var router = express.Router();

const db = require('../../database')
const {response} = require("express");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('', { title: 'book-main' });
});

router.get('/show-books', async (req, res) => {
    try {
        const rows = await db.query("SELECT * FROM book");
        res.render('books', { books: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/add-book', function(req, res, next) {
    res.render('form/add-book');
});

router.post('/add-book', async (req, res) => {
    var title = req.body.book_title;
    var author = req.body.author_name;
    var isbn = req.body.isbn;
    var quantity = req.body.available_quantity;
    var location = req.body.shelf_location;

    var query = `INSERT INTO Book (isbn, title, author, quantity, location) VALUES ("${isbn}", "${title}", "${author}", "${quantity}", "${location}")`;

    try {
        const data = await db.query(query);
        res.json({ message: "book added successfully." });
    } catch (err) {
        console.error("Error adding book:", err);
        res.status(500).json({ error: "An error occurred while adding the book." });
    }
});

router.get('/update-book', async (req, res) => {
    const { id } = req.query;

    try {
        // Fetch the book details from the database using the ID
        const [book] = await db.query('SELECT * FROM book WHERE id = ?', [id]);

        // Render the update-book view with the book details
        res.render('update-book', { book }); // Assuming the book is returned as an array
    } catch (error) {
        console.error("Error fetching book details:", error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/update', async (req, res) => {
    const { id, title, author, quantity, location } = req.body;

    try {
        // Update the book details in the database
        await db.query('UPDATE book SET title=?, author=?, quantity=?, location=? WHERE id=?', [title, author, quantity, location, id]);
        res.redirect('/book/show-books'); // Redirect back to the show-books page after updating
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/delete-book', async (req, res) => {
    const { id } = req.query;

    try {
        // Delete the book from the database using the ID
        await db.query('DELETE FROM book WHERE id = ?', [id]);
        res.sendStatus(204); // Send a 204 No Content response if successful
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;
