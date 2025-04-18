import express from 'express';
const { rekomendasi } = require('../controller/rekomen');

const router = express.Router();

router.get('/rekomendasi/:q', rekomendasi);

module.exports = router;