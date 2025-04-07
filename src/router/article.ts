import express from 'express';
const { createArticle, getAllArticles, updateArticle, deleteArticle } = require('../controller/articleControl');
const upload = require('../middleware/upload'); // Import middleware multer
const router = express.Router();

router.post('/articles', upload.single('image'), createArticle);
router.get('/articles', getAllArticles);
router.patch('/articles/:id', upload.single('image'), updateArticle);
router.delete('/articles/:id', deleteArticle);

module.exports = router;