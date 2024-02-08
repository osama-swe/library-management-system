
const express = require('express');
const router = express.Router();
const db = require('../../database');

// Route to render the Overdue Books page
router.get('/', async (req, res) => {
    try {
        // Query books that are overdue and not returned
        const overdueBooks = await db.query('SELECT * FROM book WHERE id IN (SELECT book_id FROM transaction WHERE returned = false AND due_date < CURRENT_TIMESTAMP)');
        res.render('overdue.hbs', { overdueBooks: overdueBooks[0] });
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
