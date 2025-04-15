"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma"); // Import Prisma untuk akses database
const blacklistToken = new Set();
const accessValidation = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: "Token diperlukan" });
    }
    const token = authorization.split(" ")[1];
    if (blacklistToken.has(token)) {
        return res.status(401).json({ message: "Token sudah logout" });
    }
    try {
        const jwtDecode = jwt.verify(token, process.env.JWT_SECRET);
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
    }
    catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Unauthorized", error });
    }
};
module.exports = { accessValidation, blacklistToken };
