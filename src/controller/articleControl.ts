import express from 'express';
const prisma = require('../config/prisma');
const dotenv = require('dotenv');

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

      // Konversi BigInt ke string
      const responseData = {
          ...result,
          id: result.id.toString(), // Konversi BigInt ke string
      };

      res.json({ message: 'CREATE ARTICLE SUCCESS', data: responseData });
  } catch (error: any) {
      console.error('Error creating article:', error.message || error);
      res.status(500).json({ message: 'CREATE ARTICLE UNSUCCESS', error: error.message || error });
  } finally {
      await prisma.$disconnect();
  }
};

const getAllArticles = async (req: express.Request, res: express.Response) => {
    try {
        const result = await prisma.articles.findMany();

        // Base URL publik dari bucket Supabase
        const baseImageUrl = "https://ggwfplbytoyuzuevhcfo.supabase.co/storage/v1/object/public/uploads/";

        // Konversi BigInt ke string dan tambahkan base URL ke path gambar
        const responseData = result.map((article: { id: bigint; image: string; [key: string]: any }) => ({
            ...article,
            id: article.id.toString(), // Konversi BigInt ke string
            image: article.image ? `${baseImageUrl}${article.image}` : null, // Tambahkan base URL
        }));

        res.json({ message: 'GET ALL ARTICLES SUCCESS', data: responseData });
    } catch (error: any) {
        console.error('Error fetching articles:', error.message || error);
        res.status(500).json({ message: 'GET ALL ARTICLES UNSUCCESS', error: error.message || error });
    } finally {
        await prisma.$disconnect();
    }
};

module.exports = {
    createArticle,
    getAllArticles,
};