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



module.exports = router;
