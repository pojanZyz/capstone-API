import express, { Request, Response } from 'express';
const { rekomendasiFromInput } = require('../controller/mlControl'); // Use ES module import for better type inference

const router = express.Router();

router.post('/rekomendasi', async (req: Request, res: Response): Promise<void> => {
  try {
    const input: number[] = req.body.input; // contoh: [0.2, 0.8, 1.0]
    if (!Array.isArray(input) || input.some((item) => typeof item !== 'number' || isNaN(item))) {
      res.status(400).json({ error: 'Input harus berupa array angka' });
      return;
    }

    const result: number[] = await rekomendasiFromInput(input);

    // Logika rekomendasi: Ambil indeks dengan nilai tertinggi
    const rekomendasiIndex = result.indexOf(Math.max(...result));
    const rekomendasi = `Rekomendasi terbaik adalah item ke-${rekomendasiIndex + 1}`;

    res.json({ prediction: result, rekomendasi });
  } catch (err) {
    res.status(500).json({ error: 'Prediction failed', detail: err });
  }
});

export default router;
