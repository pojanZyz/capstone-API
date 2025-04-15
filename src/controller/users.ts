import express, { Request } from "express";

const prisma = require("../config/prisma");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");                                
const accessValidation = require("../middleware/accessValidation")
const cleanFileName = require("../middleware/cleanFileName");
const { supabase } = require("../config/supabaseClient");
dotenv.config();

interface UserData {
    id: string;
    username: string;
    role: string;
}

// Modifikasi hanya properti yang diperlukan
interface ValidationRequest extends express.Request {
    headers: Request["headers"] & { authorization: string }; 
    userData: UserData;
}



const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, password, email } = req.body;

        // Validasi input
        if (!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Cek apakah email sudah ada
        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered!" });
        }

        let imageUrl: string | null = null;

        // Cek apakah ada file yang diunggah
        if (req.file) {
            console.log('File uploaded:', req.file.originalname);

            // Bersihkan nama file
            const originalName = req.file.originalname;
            const cleanedName = cleanFileName(originalName);
            const filePath = `users/${Date.now()}-${cleanedName}`;

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

        console.log("Password sebelum hash:", password);

        // Hash password
        const hashedPass = await bcrypt.hash(password, 10);

        // Simpan user
        const result = await prisma.users.create({
            data: {
                username,
                password: hashedPass,
                email,
                role: "user",
                image: imageUrl, // Simpan URL gambar ke database
            },
        });

        res.json({ message: "REGISTER IS SUCCESS", data: result });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "REGISTER IS UNSUCCESS", error: error });
    } finally {
        await prisma.$disconnect();
    }
};


const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) return res.status(404).json({ message: "USER NOT FOUND" });
        if (!user.password) return res.status(404).json({ message: "PASSWORD NOT SET" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "WRONG PASSWORD" });

        const payload = { id: user.id, username: user.username,email: user.email, role: user.role };
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, { expiresIn: "24h" });

        res.json({
            message: user.role === "admin" ? "Login admin successful" : "Login user successful",
            role: user.role,
            data: payload,
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    } finally {
        await prisma.$disconnect(); // Tutup koneksi Prisma setelah query selesai
    }
};

const logout = async (req: ValidationRequest, res: express.Response) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (token) {
            accessValidation.blacklistToken.add(token); // Tambahkan token ke blacklist
        }

        res.json({ message: "Logout berhasil" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    } finally {
        await prisma.$disconnect();
    }
};

const getUserLogin =  async (req: ValidationRequest, res: express.Response) => {
    try {
        const user = await prisma.users.findUnique({
            where: { id: parseInt(req.userData.id) },
            select: { id: true, username: true, email: true, role: true, image: true }
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "GET USER SUCCESS", data: user });
    } catch (error) {
        res.status(500).json({ message: "ERROR GETTING USER", error });
    }finally{
        await prisma.$disconnect();
    }
};


module.exports = {register, login, logout, getUserLogin};
