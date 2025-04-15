// src/controller/mlControl.ts
import * as tf from '@tensorflow/tfjs-node';

// kasih tipe tf.LayersModel | null
let model: tf.LayersModel | null = null;
// const modelUrl = 'https://ggwfplbytoyuzuevhcfo.supabase.co/storage/v1/object/public/model/model_wisata.json';

const loadModel = async (): Promise<void> => {
  try {
    if (!model) {
      model = await tf.loadLayersModel('./src/model/model_wisata.json');
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
  rekomendasiFromInput
};
