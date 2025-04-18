import express, { Request, Response } from 'express';
import fs from 'fs';

// Definisi tipe data
interface Wisata {
  id: number;
  nama: string;
  lokasi: string;
  kategori: string;
  deskripsi: string;
}

interface ModelData {
  data: Wisata[];
  cosine_sim: number[][];
}

// Load data dari file JSON
const rawData = fs.readFileSync('./model_wisata.json', 'utf8');
const model: ModelData = JSON.parse(rawData);

// Endpoint rekomendasi berdasarkan ID wisata
const rekomendasi =  (req: Request, res: Response) => {
  const wisataId = parseInt(req.params.id);
  const index = model.data.findIndex(w => w.id === wisataId);

  if (index === -1) {
    return res.status(404).json({ error: 'ID wisata tidak ditemukan' });
  }

  const simScores = model.cosine_sim[index];

  const rekomendasi = simScores
    .map((score, idx) => ({ score, wisata: model.data[idx] }))
    .filter((_, idx) => idx !== index)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => ({
      id: item.wisata.id,
      nama: item.wisata.nama,
      lokasi: item.wisata.lokasi,
      kategori: item.wisata.kategori,
      deskripsi: item.wisata.deskripsi,
      skor_kemiripan: item.score.toFixed(3)
    }));

  res.json({
    asal: model.data[index],
    rekomendasi
  });
};

module.exports = { rekomendasi };