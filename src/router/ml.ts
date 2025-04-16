import express, { Request, Response } from 'express';
const { rekomendasiFromInput } = require('../controller/mlControl'); // Use ES module import for better type inference

const router = express.Router();

router.post('/rekomendasi', rekomendasiFromInput);

module.exports = router;
