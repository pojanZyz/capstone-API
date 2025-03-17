"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { PrismaClient } = require("@prisma/client");
const accessValidation = require("../middleware/accessValidation.ts");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
dotenv.config();
const prisma = new PrismaClient();
const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const hashedPass = await bcrypt.hash(password, 10);
        const result = await prisma.users.create({
            data: { username, password: hashedPass, email, role: "user" }
        });
        res.json({ message: "REGISTER IS SUCCESS", data: result });
    }
    catch (error) {
        res.json({ message: "REGISTER IS UNSUCCESS", data: error
        });
    }
};
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user)
        return res.status(404).json({ message: "USER NOT FOUND" });
    if (!user.password)
        return res.status(404).json({ message: "PASSWORD NOT SET" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
        const payload = { id: user.id, username: user.username, role: user.role };
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, { expiresIn: "1h" });
        res.json({
            message: user.role === "admin" ? "Login admin successful" : "Login user successful",
            role: user.role,
            data: payload,
            token
        });
    }
    else {
        res.status(401).json({ message: "WRONG PASSWORD" });
    }
};
const logout = (req, res) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (token) {
        accessValidation.blacklistToken.add(token);
    }
    res.json({ message: "Logout berhasil" });
};
const getUserLogin = async (req, res) => {
    try {
        const user = await prisma.users.findUnique({
            where: { id: parseInt(req.userData.id) },
            select: { id: true, username: true, email: true, role: true }
        });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json({ message: "GET USER SUCCESS", data: user });
    }
    catch (error) {
        res.status(500).json({ message: "ERROR GETTING USER", error });
    }
};
module.exports = { register, login, logout, getUserLogin };
