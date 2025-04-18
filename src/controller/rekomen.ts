import express, { Request, Response } from 'express';
import fs from 'fs';

// Definisi tipe data
interface Wisata {
    "id": number,
    "title": string,
    "category": "Wisata" | "Budaya",
    "location": string,
    "image": string,
    "shortdesc": string,
    "longdesc": string
  }
  

interface ModelData {
  data: Wisata[];
  cosine_sim: number[][];
}

// Load data dari file JSON
const rawData = fs.readFileSync('./src/model/model_wisata.json', 'utf8');
const model: ModelData = JSON.parse(rawData);

// Endpoint rekomendasi berdasarkan nama wisata
const rekomendasi = (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query) {
    return res.status(400).json({ error: 'Parameter query (q) diperlukan' });
  }

  // Cari indeks berdasarkan nama (case-insensitive, cocok sebagian)
  const index = model.data.findIndex(w =>
    w.title.toLowerCase().includes(query.toLowerCase())
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Wisata tidak ditemukan berdasarkan query tersebut' });
  }

  const simScores = model.cosine_sim[index];

  const rekomendasi = simScores
    .map((score, idx) => ({ score, wisata: model.data[idx] }))
    .filter((_, idx) => idx !== index)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => ({
      id: item.wisata.id,
      title: item.wisata.title,
      category: item.wisata.category,
      location: item.wisata.location,
      image: item.wisata.image,
      shortdesc: item.wisata.shortdesc,
      longdesc: item.wisata.longdesc,
      skor_kemiripan: item.score.toFixed(3)
    }));

  res.json({
    asal: model.data[index],
    rekomendasi
  });
};

module.exports = { rekomendasi };
