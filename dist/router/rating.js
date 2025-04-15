"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { addFeedback } = require('../controller/ratingControl');
const { accessValidation } = require('../middleware/accessValidation');
const { getFeedbackByArticle } = require('../controller/ratingControl');
const { deleteFeedback } = require('../controller/ratingControl');
const router = express_1.default.Router();
// Endpoint untuk memberikan feedback pada artikel
router.post('/articles/:id/feedback', accessValidation, addFeedback);
router.get('/articles/:id/feedback', getFeedbackByArticle);
router.delete('/articles/:id/feedback', accessValidation, deleteFeedback);
module.exports = router;
