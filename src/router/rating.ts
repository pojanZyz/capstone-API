import express from 'express';
const { addRating } = require('../controller/ratingControl');
const { accessValidation } = require('../middleware/accessValidation');

const router = express.Router();

// Endpoint untuk memberikan rating dan ulasan
router.post('/articles/:id/rating', accessValidation, addRating);

module.exports = router;