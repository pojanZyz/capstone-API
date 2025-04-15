import express from 'express';
const { predictFromInput } = require('../controller/mlControl');

const router = express.Router();

router.post('/predict', async (req: express.Request, res: express.Response) => {
  try {
    const input = req.body.input; // contoh: [0.2, 0.8, 1.0]
    const result = await predictFromInput(input);
    res.json({ prediction: result });
  } catch (err) {
    res.status(500).json({ error: 'Prediction failed', detail: err });
  }
});

module.exports = router;
