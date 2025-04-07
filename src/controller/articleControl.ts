import express from 'express';
import { moveCursor } from 'readline';
const prisma = require('../config/prisma');
const dotenv = require('dotenv');
const upload = require('../middleware/upload'); // Import middleware multer

dotenv.config();

const createArticle = async (req: express.Request, res: express.Response) => {
  try {
      const { title, category, description, location } = req.body;
      let imageUrl: string | null = null;

      // Cek apakah ada file yang diunggah
      if (req.file) {
          console.log('File uploaded:', req.file.originalname);
          imageUrl = `uploads/${Date.now()}-${req.file.originalname}`;
      }

      const result = await prisma.articles.create({
          data: {
              title,
              category,
              description,
              location,
              image: imageUrl, // Simpan URL gambar ke database
          },
      });

      res.json({ message: 'CREATE ARTICLE SUCCESS', data: result });
  } catch (error: any) { // Pastikan `error` memiliki tipe `any` untuk mengakses `error.message`
      console.error('Error creating article:', error.message || error);
      res.status(500).json({ message: 'CREATE ARTICLE UNSUCCESS', error: error.message || error });
  } finally {
      await prisma.$disconnect();
  }
};
module.exports = {
    createArticle
  }