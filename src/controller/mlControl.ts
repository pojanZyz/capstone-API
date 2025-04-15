// src/controller/mlControl.ts
import * as tf from '@tensorflow/tfjs-node';

// kasih tipe tf.LayersModel | null
let model: tf.LayersModel | null = null;

const loadModel = async (): Promise<void> => {
  if (!model) {
    model = await tf.loadLayersModel('file://src/model/model_wisata.json');
  }
};

const predictFromInput = async (input: number[]): Promise<number[]> => {
  await loadModel();

  const tensorInput = tf.tensor2d([input], [1, input.length]);
  const prediction = model!.predict(tensorInput) as tf.Tensor;
  const result = await prediction.data();

  return Array.from(result);
};

module.exports = {
  predictFromInput,
  loadModel
};