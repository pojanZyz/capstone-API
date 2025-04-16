import express from 'express';
const path = require('path');

// Define the model structure
interface Model {
  cosine_sim: number[][];
  data: { [key: string]: any }[];
}

// Load the model JSON
const model: Model = require('../model/model_wisata.json');

const rekomendasiFromInput = async (req: express.Request, res: express.Response) => {
  try {
    let input: number[] = req.body.input; // Ensure input is an array of numbers
    if (!Array.isArray(input)) {
      return res.status(400).json({ error: 'Input harus berupa array angka' });
    }

    // Add default elements (0) if input length is less than 20
    while (input.length < 20) {
      input.push(0);
    }

    console.log('Input setelah dilengkapi:', input); // Log input for debugging
    console.log('Cosine Similarity Matrix:', model.cosine_sim); // Log cosine similarity matrix

    // Calculate similarity scores using the cosine similarity matrix
    const similarities = model.cosine_sim.map((row: number[], index: number) => {
      const score = row.reduce((sum: number, val: number, i: number) => sum + val * input[i], 0);
      console.log(`Score for index ${index}:`, score); // Log similarity score for each destination
      return { index, score };
    });

    // Sort by highest score and take the top 3 recommendations
    const topRecommendations = similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => ({
        ...model.data[item.index],
        skor_kemiripan: item.score,
      }));

    res.json({ rekomendasi: topRecommendations });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

module.exports = { rekomendasiFromInput };