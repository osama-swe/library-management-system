

const express = require('express');
const router = express.Router();
const db = require('../../database');

// Route to render the Return Book page
router.get('/', async (req, res) => {
    try {
        // Query transactions with returned set to false
        const transactions = await db.query('SELECT * FROM transaction WHERE returned = false');
        res.render('return.hbs', { transactions: transactions[0] });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to handle marking a transaction as returned and updating book quantity
router.post('/mark-as-returned', async (req, res) => {
    const transactionId = req.body.transactionId;
    const bookId = req.body.bookId;
    console.log('trans id ' + transactionId)
    console.log('book id ' + bookId)
    try {
        // Update the 'returned' column in the transaction table to true
        await db.query('UPDATE transaction SET returned = true WHERE id = ?', [transactionId]);

        // Increment the quantity of the returned book in the book table by 1
        await db.query('UPDATE book SET quantity = quantity + 1 WHERE id = ?', [bookId]);

        res.redirect('/return');
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
