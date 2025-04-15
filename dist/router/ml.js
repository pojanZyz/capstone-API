"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mlControl_1 = require("../controller/mlControl"); // Use ES module import for better type inference
const router = express_1.default.Router();
router.post('/rekomendasi', async (req, res) => {
    try {
        const input = req.body.input; // contoh: [0.2, 0.8, 1.0]
        if (!Array.isArray(input) || input.some((item) => typeof item !== 'number' || isNaN(item))) {
            res.status(400).json({ error: 'Input harus berupa array angka' });
            return;
        }
        const result = await (0, mlControl_1.rekomendasiFromInput)(input);
        // Logika rekomendasi: Ambil indeks dengan nilai tertinggi
        const rekomendasiIndex = result.indexOf(Math.max(...result));
        const rekomendasi = `Rekomendasi terbaik adalah item ke-${rekomendasiIndex + 1}`;
        res.json({ prediction: result, rekomendasi });
    }
    catch (err) {
        res.status(500).json({ error: 'Prediction failed', detail: err });
    }
});
exports.default = router;
