import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma"); // Import Prisma untuk akses database

const blacklistToken: Set<string> = new Set();

interface UserData {
    id: string;
    username: string;
    role: string;
    image: string;
}

interface ValidationRequest extends Request {
    headers: Request["headers"] & { authorization: string };
    userData?: UserData; // Gunakan optional chaining agar tidak error jika undefined
}

const accessValidation = async (req: ValidationRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: "Token diperlukan" });
    }

    const token = authorization.split(" ")[1];

    if (blacklistToken.has(token)) {
        return res.status(401).json({ message: "Token sudah logout" });
    }

    try {
        const jwtDecode = jwt.verify(token, process.env.JWT_SECRET) as UserData;

        if (!jwtDecode || !jwtDecode.id || !jwtDecode.username || !jwtDecode.role) {
            return res.status(401).json({ message: "Invalid token data" });
        }

        // Ambil data pengguna dari database jika `image` tidak tersedia di token
        if (!jwtDecode.image) {
            const user = await prisma.users.findUnique({
                where: { id: parseInt(jwtDecode.id) },
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            jwtDecode.image = user.image; // Tambahkan `image` dari database ke token decode
        }

        req.userData = jwtDecode; // ✅ Tambahkan userData ke req
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Unauthorized", error });
    }
};

module.exports = { accessValidation, blacklistToken };