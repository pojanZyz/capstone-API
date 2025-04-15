// src/controller/mlControl.ts
import * as tf from '@tensorflow/tfjs-node';

// kasih tipe tf.LayersModel | null
let model: tf.LayersModel | null = null;
const modelUrl = 'https://ggwfplbytoyuzuevhcfo.supabase.co/storage/v1/object/public/model/model_wisata.json';

const loadModel = async (): Promise<void> => {
  if (!model) {
    model = await tf.loadLayersModel(modelUrl);
  }
};

const predictFromInput = async (input: number[]): Promise<number[]> => {
  await loadModel();

  const tensorInput = tf.tensor2d([input], [1, input.length]);
  const prediction = model!.predict(tensorInput) as tf.Tensor;
  const result = await prediction.data();
  tensorInput.dispose();
  prediction.dispose();
  return Array.from(result);
};

export default {
  predictFromInput,
  loadModel
};