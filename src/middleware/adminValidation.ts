import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken")

interface UserData {
    id: string;
    username: string;
    role: string;
}

interface ValidationRequest extends Request {
    headers: Request["headers"] & { authorization: string }; 
    userData: UserData;
}

const adminValidation = (req: ValidationRequest, res: Response, next: NextFunction) => {  

    if (req.userData.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Only admin can access this" });
    }
    next();                                                 
};

module.exports = {adminValidation};