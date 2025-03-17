import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

const blacklistToken: Set<string> = new Set();

interface UserData {
    id: string;
    username: string;
    role: string;
}

interface ValidationRequest extends Request {
    headers: Request["headers"] & { authorization: string }; 
    userData?: UserData; // Gunakan optional chaining agar tidak error jika undefined
}

const accessValidation = (req: ValidationRequest, res: Response, next: NextFunction) => {
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

        req.userData = jwtDecode; // ✅ Tambahkan userData ke req
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized", error });
    }
};

module.exports = { accessValidation, blacklistToken };
