import express from 'express';
const { createArticle } = require('../controller/articleControl');
const upload = require('../middleware/upload'); // Import middleware multer
const router = express.Router();

router.post('/articles', upload.single('image'), createArticle);

module.exports = router;