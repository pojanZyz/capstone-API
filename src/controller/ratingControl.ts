import express from 'express';
const prisma = require('../config/prisma');

const addRating = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params; // ID artikel
        const { rating, ulasan } = req.body; // Data rating dan ulasan
        const userId = req.userData.id; // ID user dari token
        const username = req.userData.username; // Username dari token

        // Validasi input
        if (!rating || !ulasan) {
            return res.status(400).json({ message: "Rating and review are required!" });
        }

        // Validasi rating (1-5)
        if (![1, 2, 3, 4, 5].includes(rating)) {
            return res.status(400).json({ message: "Rating must be between 1 and 5!" });
        }

        // Cek apakah artikel ada
        const article = await prisma.articles.findUnique({ where: { id: BigInt(id) } });
        if (!article) {
            return res.status(404).json({ message: "Article not found!" });
        }

        // Simpan rating dan ulasan ke database
        const result = await prisma.rating.create({
            data: {
                rating,
                ulasan,
                userid: parseInt(userId),
                users: { connect: { id: parseInt(userId) } }, // Hubungkan dengan user
                createdAt: new Date(),
            },
        });

        res.json({
            message: "Rating and review added successfully!",
            data: {
                id: result.id.toString(),
                username,
                rating: result.rating,
                ulasan: result.ulasan,
                createdAt: result.createdAt,
            },
        });
    } catch (error) {
        console.error("Error adding rating:", error);
        res.status(500).json({ message: "Internal server error", error });
    } finally {
        await prisma.$disconnect();
    }
};

module.exports = { addRating };