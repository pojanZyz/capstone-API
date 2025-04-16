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
    const query = req.body.query;
    if (typeof query !== 'string' || query.trim() === '') {
      return res.status(400).json({ error: 'Query harus berupa string dan tidak boleh kosong' });
    }

    const lowerCaseQuery = query.toLowerCase(); // Convert query to lowercase

    // Filter data berdasarkan substring pada semua atribut (nama, kategori, lokasi, deskripsi)
    const hasilPencarian = model.data.filter(item => {
      return (
        item.nama.toLowerCase().includes(lowerCaseQuery) ||
        item.kategori.toLowerCase().includes(lowerCaseQuery) ||
        item.lokasi.toLowerCase().includes(lowerCaseQuery) ||
        item.deskripsi.toLowerCase().includes(lowerCaseQuery)
      );
    });

    res.json({ hasil: hasilPencarian });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error });
  }
};

module.exports = { rekomendasiFromInput };