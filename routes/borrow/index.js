const express = require('express');
const router = express.Router();
const db = require('../../database');

// Route to render the borrowing view
router.get('/', async (req, res) => {
    try {
        // Query all books with quantity greater than 0
        const books = await db.query('SELECT * FROM book WHERE quantity > 0');

        // Query all borrower IDs from the database
        const borrowerIds = await db.query('SELECT id FROM borrower');

        res.render('borrow.hbs', { books: books[0], borrowerIds: borrowerIds[0] });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to handle borrowing a book
router.post('/', async (req, res) => {
    const bookId = req.body.bookId;
    const borrowerId = req.body.borrowerId;

    try {
        // Calculate due date (10 days from the current date) and format it in SQL DATETIME format
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 10); // Add 10 days
        const formattedDueDate = dueDate.toISOString().slice(0, 19).replace('T', ' '); // Format as 'YYYY-MM-DD HH:MM:SS'

        // Insert a new record into the transaction table
        await db.query('INSERT INTO transaction (book_id, borrower_id, due_date, returned) VALUES (?, ?, ?, ?)', [bookId, borrowerId, formattedDueDate, false]);

        // Decrement the quantity by 1
        await db.query('UPDATE book SET quantity = quantity - 1 WHERE id = ?', [bookId]);

        res.redirect('/borrow');
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
