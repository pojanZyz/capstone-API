import type { NextFunction, Request, Response } from "express";
const usersRouter = require("./router/users");
const adminRouter = require("./router/admin");

const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");                                
const cors = require("cors");

dotenv.config();
const prisma = require("../configuration/prisma");
const app = express();

app.use(cors()); // Mengizinkan semua domain mengakses API
app.use(express.json());

app.use('/users', usersRouter);
app.use('/', adminRouter);

app.listen(4000, () => {
    console.log("server berjalan di port 4000");
});

module.exports = app;