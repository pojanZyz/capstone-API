import express from 'express';
const { createArticle, getAllArticles, updateArticle, deleteArticle } = require('../controller/articleControl');
const { accessValidation } = require('../middleware/accessValidation'); // Import middleware accessValidation
const { adminValidation } = require('../middleware/adminValidation'); // Import middleware adminValidation
const upload = require('../middleware/upload'); // Import middleware multer
const router = express.Router();

router.post('/articles', upload.single('image'), accessValidation, adminValidation, createArticle);
router.get('/articles',  accessValidation ,getAllArticles);
router.patch('/articles/:id', upload.single('image'),  accessValidation ,updateArticle);
router.delete('/articles/:id', accessValidation, deleteArticle);

module.exports = router;