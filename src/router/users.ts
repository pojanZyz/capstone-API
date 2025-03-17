import { NextFunction, Request, Response } from "express";
const {register,login,logout,getUserLogin} = require("../controller/users.ts");
const {accessValidation} = require("../middleware/accessValidation.ts")
import express from "express";
const jwt = require("jsonwebtoken");

const app = express.Router();

//  REGISTER
app.post('/register', register);

// LOGIN
app.post('/login', login);

// LOGOUT
app.post('/logout', accessValidation, logout);

// GET DATA USER LOGIN
app.get('/me', accessValidation, getUserLogin);

module.exports = app;