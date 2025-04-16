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
    const query = req.body.query?.toLowerCase(); // Ambil query dari request body
    if (!query) {
      return res.status(400).json({ error: 'Query tidak boleh kosong' });
    }

    // Filter data berdasarkan substring pada semua atribut (nama, kategori, lokasi, deskripsi)
    const hasilPencarian = model.data.filter(item => {
      return (
        item.nama.toLowerCase().includes(query) ||
        item.kategori.toLowerCase().includes(query) ||
        item.lokasi.toLowerCase().includes(query) ||
        item.deskripsi.toLowerCase().includes(query)
      );
    });

    res.json({ hasil: hasilPencarian });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error });
  }
};

module.exports = { rekomendasiFromInput };