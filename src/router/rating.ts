import express from 'express';
const { addFeedback } = require('../controller/ratingControl');
const { accessValidation } = require('../middleware/accessValidation');
const { getFeedbackByArticle } = require('../controller/ratingControl');
const { updateFeedback } = require('../controller/ratingControl');
const { deleteFeedback } = require('../controller/ratingControl');
const router = express.Router();

// Endpoint untuk memberikan feedback pada artikel
router.post('/articles/:id/feedback', accessValidation, addFeedback);
router.get('/articles/:id/feedback', getFeedbackByArticle);
router.delete('/articles/:id/feedback', accessValidation, deleteFeedback);
module.exports = router;

