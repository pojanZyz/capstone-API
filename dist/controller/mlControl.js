"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.rekomendasiFromInput = exports.loadModel = void 0;
// src/controller/mlControl.ts
const tf = __importStar(require("@tensorflow/tfjs-node"));
// kasih tipe tf.LayersModel | null
let model = null;
// const modelUrl = 'https://ggwfplbytoyuzuevhcfo.supabase.co/storage/v1/object/public/model/model_wisata.json';
const loadModel = async () => {
    try {
        if (!model) {
            model = await tf.loadLayersModel('./src/model/model_wisata.json');
        }
    }
    catch (error) {
        console.error('Error loading model:', error);
        throw new Error('Failed to load model');
    }
};
exports.loadModel = loadModel;
const rekomendasiFromInput = async (input) => {
    try {
        await (0, exports.loadModel)();
        const tensorInput = tf.tensor2d([input], [1, input.length]);
        const prediction = model.predict(tensorInput);
        const result = await prediction.data();
        tensorInput.dispose();
        prediction.dispose();
        return Array.from(result);
    }
    catch (error) {
        console.error('Error during prediction:', error);
        throw new Error('Prediction failed');
    }
};
exports.rekomendasiFromInput = rekomendasiFromInput;
