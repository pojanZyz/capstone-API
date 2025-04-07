import express from 'express';
import { get } from 'http';
const { createArticle, getAllArticles } = require('../controller/articleControl');
const upload = require('../middleware/upload'); // Import middleware multer
const router = express.Router();

router.post('/articles', upload.single('image'), createArticle);
router.get('/articles', getAllArticles);
module.exports = router;