import express from 'express';
const prisma = require('../config/prisma');
const dotenv = require('dotenv');
const cleanFileName = require("../middleware/cleanFileName");
const { supabase } = require("../config/supabaseClient");

dotenv.config();

const createArticle = async (req: express.Request, res: express.Response) => {
    try {
        const { title, category, shortdesc, longdesc, location } = req.body;
        let imageUrl: string | null = null;

        // Validasi category
        const validCategories = ["Wisata", "Budaya"];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                message: "CREATE ARTICLE UNSUCCESS",
                error: `Invalid category. Allowed values are: ${validCategories.join(", ")}`,
            });
        }

        if (req.file) {
            console.log('File uploaded:', req.file.originalname);

            // Bersihkan nama file
            const originalName = req.file.originalname;
            const cleanedName = cleanFileName(originalName);
            const filePath = `articles/${Date.now()}-${cleanedName}`;

            // Unggah file ke bucket Supabase
            const { data, error } = await supabase.storage
                .from('uploads') // Nama bucket
                .upload(filePath, req.file.buffer, {
                    contentType: req.file.mimetype,
                });

            if (error) {
                throw new Error(`Failed to upload image: ${error.message}`);
            }

            // Simpan URL publik gambar
            imageUrl = `https://ggwfplbytoyuzuevhcfo.supabase.co/storage/v1/object/public/uploads/${filePath}`;
        }

        const result = await prisma.articles.create({
            data: {
                title,
                category,
                shortdesc,
                longdesc,
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
            image: article.image ? article.image : null, // Gunakan URL gambar langsung dari database
        }));

        res.json({ message: 'GET ALL ARTICLES SUCCESS', data: responseData });
    } catch (error: any) {
        console.error('Error fetching articles:', error.message || error);
        res.status(500).json({ message: 'GET ALL ARTICLES UNSUCCESS', error: error.message || error });
    } finally {
        await prisma.$disconnect();
    }
};

// Update Article
const updateArticle = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params; // ID dari parameter URL
        const { title, category, shortdesc, longdesc, location } = req.body; // Data dari body request
        let imageUrl: string | null = null;

        const existingArticle = await prisma.articles.findUnique({
            where: { id: BigInt(id) },
        });
        if (!existingArticle) {
            return res.status(404).json({
                message: "UPDATE ARTICLE UNSUCCESS",
                error: "Article not found",
            });
        }

        // Validasi category
        const validCategories = ["Wisata", "Budaya"];
        if (category && !validCategories.includes(category)) {
            return res.status(400).json({
                message: "UPDATE ARTICLE UNSUCCESS",
                error: `Invalid category. Allowed values are: ${validCategories.join(", ")}`,
            });
        }


        // Cek apakah ada file yang diunggah
        if (req.file) {
            console.log('File uploaded:', req.file.originalname);

            // Bersihkan nama file
            const originalName = req.file.originalname;
            const cleanedName = cleanFileName(originalName);
            const filePath = `articles/${Date.now()}-${cleanedName}`;

            // Unggah file ke bucket Supabase
            const { data, error } = await supabase.storage
                .from('uploads') // Nama bucket
                .upload(filePath, req.file.buffer, {
                    contentType: req.file.mimetype,
                });

            if (error) {
                throw new Error(`Failed to upload image: ${error.message}`);
            }

            // Simpan URL publik gambar
            imageUrl = `https://ggwfplbytoyuzuevhcfo.supabase.co/storage/v1/object/public/uploads/${filePath}`;
        }

        // Update artikel di database
        const updatedArticle = await prisma.articles.update({
            where: { id: BigInt(id) }, // Pastikan ID dikonversi ke BigInt
            data: {
                title,
                category,
                shortdesc,
                longdesc,
                location,
                image: imageUrl || undefined, // Update gambar hanya jika ada file baru
            },
        });

        // Konversi BigInt ke string sebelum mengirim respons
        const responseData = {
            ...updatedArticle,
            id: updatedArticle.id.toString(), // Konversi BigInt ke string
        };

        res.json({ message: 'UPDATE ARTICLE SUCCESS', data: responseData });
    } catch (error: any) {
        console.error('Error updating article:', error.message || error);
        res.status(500).json({ message: 'UPDATE ARTICLE UNSUCCESS', error: error.message || error });
    } finally {
        await prisma.$disconnect();
    }
};

// Delete Article
const deleteArticle = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const existingArticle = await prisma.articles.findUnique({
            where: { id: BigInt(id) },
        });
        if (!existingArticle) {
            return res.status(404).json({
                message: "UPDATE ARTICLE UNSUCCESS",
                error: "Article not found",
            });
        }

        // Hapus artikel dari database
        const deletedArticle = await prisma.articles.delete({
            where: { id: BigInt(id) },
        });

        const responseData = {
            ...deletedArticle,
            id: deletedArticle.id.toString(), // Konversi BigInt ke string
        };

        res.json({ message: 'DELETE ARTICLE SUCCESS', data: responseData });
    } catch (error: any) {
        console.error('Error deleting article:', error.message || error);
        res.status(500).json({ message: 'DELETE ARTICLE UNSUCCESS', error: error.message || error });
    } finally {
        await prisma.$disconnect();
    }
};

module.exports = {
    createArticle,
    getAllArticles,
    updateArticle,
    deleteArticle,
};