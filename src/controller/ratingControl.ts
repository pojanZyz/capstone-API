import { User } from '@supabase/supabase-js';
import express from 'express';
const prisma = require('../config/prisma');

interface UserData {
    id: string;
    username: string;
    role: string;
    image: string;
}

interface ValidationRequest extends express.Request {
    headers: express.Request["headers"] & { authorization: string }; 
    userData: UserData;
}

const addFeedback = async (req: ValidationRequest , res: express.Response) => {
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

        // Simpan feedback ke database
        const result = await prisma.feedback.create({
            data: {
                rating,
                ulasan,
                username,
                users: { connect: { id: parseInt(userId) } }, // Hubungkan dengan user melalui relasi
                articles: { connect: { id: BigInt(id) } }, // Hubungkan dengan artikel melalui relasi
                createdAt: new Date(),
            },
        });

        res.json({
            message: "Feedback added successfully!",
            data: {
                id: result.id.toString(),
                rating: result.rating,
                ulasan: result.ulasan,
                username: result.username,
                createdAt: result.createdAt,
            },
        });
    } catch (error) {
        console.error("Error adding feedback:", error);
        res.status(500).json({ message: "Internal server error", error });
    } finally {
        await prisma.$disconnect();
    }
};

const getFeedbackByArticle = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params; // ID artikel

        // Ambil semua feedback berdasarkan articleId
        const feedbacks = await prisma.feedback.findMany({
            where: { articleid: BigInt(id) },
            include: { users: true }, // Sertakan data pengguna
        });

        if (feedbacks.length === 0) {
            return res.status(404).json({ message: "No feedback found for this article." });
        }

        // Format respons
        const formattedFeedbacks = feedbacks.map((feedback: typeof prisma.feedback) => ({
            id: feedback.id.toString(),
            username: feedback.users?.username || "Anonymous",
            rating: feedback.rating,
            ulasan: feedback.ulasan,
            createdAt: feedback.createdAt,
        }));

        res.json({
            message: "Feedback retrieved successfully!",
            data: formattedFeedbacks,
        });
    } catch (error) {
        console.error("Error retrieving feedback:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Delete Feedback
const deleteFeedback = async (req: ValidationRequest, res: express.Response) => {
    try {
        const { id } = req.params; // ID feedback
        const userId = req.userData.id; // ID user dari token
        const userRole = req.userData.role; // Role user dari token

        // Ambil feedback berdasarkan ID
        const feedback = await prisma.feedback.findUnique({
            where: { id: BigInt(id) },
        });

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found!" });
        }


        // Hapus feedback
        await prisma.feedback.delete({
            where: { id: BigInt(id) },
        });

        res.json({ message: "Feedback deleted successfully!" });
    } catch (error) {
        console.error("Error deleting feedback:", error);
        res.status(500).json({ message: "Internal server error", error });
    } finally {
        await prisma.$disconnect();
    }
};

module.exports = { addFeedback, getFeedbackByArticle, deleteFeedback };