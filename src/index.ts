import type { NextFunction, Request, Response } from "express";
const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");                                
const cors = require("cors");

dotenv.config();
const prisma = new PrismaClient();
const app = express();
app.use(cors()); // Mengizinkan semua domain mengakses API
app.use(express.json());

interface UserData {
    id: string;
    username: string;
    role: string;
}

// Modifikasi hanya properti yang diperlukan
interface ValidationRequest extends Request {
    headers: Request["headers"] & { authorization: string }; 
    userData: UserData;
}

const adminValidation = (req : ValidationRequest,  res : Response, next : NextFunction) => {

    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "ACCESS DENIED" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "FORBIDDEN: Admin Only" });
        }

        req.userData = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "INVALID TOKEN" });
    }
};

const accessValidation = (req : ValidationRequest, res : Response, next : NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
        res.status(401).json({
            message: "Token Diperlukan"
        });
        return;
    }

    const token = authorization.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    try {
        const jwtDecode = jwt.verify(token, secret);
        req.userData = jwtDecode;
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }
    next();
};

app.post("/register", async (req : Request, res : Response) => {
    try {
        const { username, password, email } = req.body;
        const hashedPass = await bcrypt.hash(password, 10);
        const result = await prisma.users.create({
            data: { username, password: hashedPass, email, role: "user"}
        });
        res.json({ message: "REGISTER IS SUCCESS", data: result });
    } catch (error) {
        res.json({ message: "REGISTER IS UNSUCCESS", data: error
         });
    }
});

app.post("/login", async (req : Request, res : Response) => {
    const { email, password } = req.body;
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: "USER NOT FOUND" });
    if (!user.password) return res.status(404).json({ message: "PASSWORD NOT SET" });

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
    } else {
        res.status(401).json({ message: "WRONG PASSWORD" });
    }
});

app.post("/users", accessValidation, async (req : Request, res : Response) => {
    try {
        const { username, password, email } = req.body;
        const result = await prisma.users.create({ data: { username, password, email, role: "user" } });
        res.json({ message: "CREATE USER SUCCESS", data: result });
    } catch (error) {
        res.json({ message: "CREATE USER UNSUCCESS", error });
    }
});

app.get("/users", accessValidation, async (req : Request, res : Response) => {
    try {
        const result = await prisma.users.findMany();
        res.json({ message: "GET ALL USERS SUCCESS", data: result });
    } catch (error) {
        res.json({ message: "GET ALL USER UNSUCCESS", error });
    }
});

app.patch("/users/update/:id", accessValidation, async (req : Request, res : Response) => {
    try {
        const { id } = req.params;
        const { username, password, email } = req.body;
        const hashedPass = await bcrypt.hash(password, 10);
        const result = await prisma.users.update({
            where: { id: parseInt(id) },
            data: { username, password: hashedPass, email }
        });
        res.json({ message: "UPDATE USER SUCCESS", data: result });
    } catch (error) {
        res.json({ message: "UPDATE USER UNSUCCESS", error });
    }
});

app.delete("/users/:id", accessValidation, async (req : Request, res : Response) => {
    try {
        const { id } = req.params;
        const result = await prisma.users.delete({ where: { id: parseInt(id) } });
        await prisma.$executeRaw`SET @num := 0;`;
        await prisma.$executeRaw`UPDATE users SET id = (@num := @num + 1);`;
        await prisma.$executeRaw`ALTER TABLE users AUTO_INCREMENT = 1;`;
        res.json({ message: "DELETE USER SUCCESS", data: result });
    } catch (error) {
        res.json({ message: "DELETE USER UNSUCCESS", error });
    }
});

app.listen(4000, () => {
    console.log("server berjalan di port 4000");
});

module.exports = app;