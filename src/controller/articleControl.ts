import express from 'express';
import { moveCursor } from 'readline';
const prisma = require('../config/prisma');
const dotenv = require('dotenv');
const upload = require('../middleware/upload'); // Import middleware multer

dotenv.config();

const createArticle = async (req: express.Request, res: express.Response) => {
    try {
        const { title, content } = req.body;
        let imageUrl: string | null = null;

        // Cek apakah ada file yang diunggah
        if (req.file) {
            console.log('File uploaded:', req.file.originalname);
            imageUrl = `uploads/${Date.now()}-${req.file.originalname}`;
        }

        const result = await prisma.articles.create({
            data: {
                title,
                content,
                image_url: imageUrl,
            },
        });

        res.json({ message: 'CREATE ARTICLE SUCCESS', data: result });
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({ message: 'CREATE ARTICLE UNSUCCESS', error });
    } finally {
        await prisma.$disconnect();
    }
};

module.exports = {
    createArticle
  }