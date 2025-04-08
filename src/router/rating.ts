import express from 'express';
const { addFeedback } = require('../controller/ratingControl');
const { accessValidation } = require('../middleware/accessValidation');

const router = express.Router();

// Endpoint untuk memberikan feedback pada artikel
router.post('/articles/:id/feedback', accessValidation, addFeedback);

module.exports = router;