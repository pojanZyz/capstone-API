// src/controller/mlControl.ts
const path = require('path');
import * as tf from '@tensorflow/tfjs-node';

// kasih tipe tf.LayersModel | null
let model: tf.LayersModel | null = null;
// filepath: d:\Dicoding-indonesia\project-capstone\capstone-API-rajif (1)\capstone-API-rajif\src\controller\mlControl.ts

const loadModel = async (): Promise<void> => {
  try {
    if (!model) {
      const modelPath = `file://${path.resolve(__dirname, '../model/model_wisata.json')}`;
      model = await tf.loadLayersModel(modelPath);
    }
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error('Failed to load model');
  }
};

const rekomendasiFromInput = async (input: number[]): Promise<number[]> => {
  try {
    await loadModel();

    const tensorInput = tf.tensor2d([input], [1, input.length]);
    const prediction = model!.predict(tensorInput) as tf.Tensor;
    const result = await prediction.data();
    tensorInput.dispose();
    prediction.dispose();
    return Array.from(result);
  } catch (error) {
    console.error('Error during prediction:', error);
    throw new Error('Prediction failed');
  }
};

module.exports = {
  rekomendasiFromInput,
  loadModel
};
