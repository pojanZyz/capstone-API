import { NextFunction, Request, Response } from "express";
const cors = require("cors");
const {register,login,logout,getUserLogin} = require("../controller/users");
const {accessValidation} = require("../middleware/accessValidation")
import express from "express";
const jwt = require("jsonwebtoken");

const router = express.Router();
const app = express.Router();
app.use(cors({
    origin: "*", // Mengizinkan semua origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Metode yang diizinkan
    allowedHeaders: ["Content-Type"] // Header yang diizinkan
}));

//  REGISTER
router.post('/register', register);

// LOGIN
router.post('/login', login);

// LOGOUT
router.post('/logout', accessValidation, logout);

// GET DATA USER LOGIN
router.get('/me', accessValidation, getUserLogin);

module.exports = router;