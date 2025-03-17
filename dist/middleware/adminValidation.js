"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const adminValidation = (req, res, next) => {
    if (req.userData.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Only admin can access this" });
    }
    next();
};
module.exports = { adminValidation };
