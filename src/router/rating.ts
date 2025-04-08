import express from 'express';
const { addFeedback } = require('../controller/ratingControl');
const { accessValidation } = require('../middleware/accessValidation');
const { adminValidation } = require('../middleware/adminValidation');
const { getFeedbackByArticle } = require('../controller/ratingControl');
const { updateFeedback } = require('../controller/ratingControl');
const { deleteFeedback } = require('../controller/ratingControl');
const router = express.Router();

// Endpoint untuk memberikan feedback pada artikel
router.post('/articles/:id/feedback', accessValidation, addFeedback);
router.get('/articles/:id/feedback', getFeedbackByArticle);
router.patch('/articles/:id/feedback', accessValidation, adminValidation, updateFeedback);
router.delete('/articles/:id/feedback', accessValidation, adminValidation, deleteFeedback);
module.exports = router;

