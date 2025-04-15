import express from 'express';
const { createArticle, getAllArticles, updateArticle, deleteArticle, getArticleById } = require('../controller/articleControl');
const { accessValidation } = require('../middleware/accessValidation'); // Import middleware accessValidation
const { adminValidation } = require('../middleware/adminValidation'); // Import middleware adminValidation
const upload = require('../middleware/upload'); // Import middleware multer
const router = express.Router();

router.post('/articles', upload.single('image'), accessValidation, adminValidation, createArticle);
router.get('/articles',  getAllArticles);
router.get('/articles/:id',  getArticleById);
router.patch('/articles/:id', upload.single('image'),  accessValidation , adminValidation ,updateArticle);
router.delete('/articles/:id', accessValidation, adminValidation, deleteArticle);

module.exports = router;