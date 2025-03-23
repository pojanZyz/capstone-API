import { Request, Response, NextFunction } from "express";
const express = require("express");
const usersRouter = require("./router/users");
const adminRouter = require("./router/admin");


const dotenv = require("dotenv");                            
const app = express();
const cors = require("cors");

dotenv.config();
app.use(cors({
    origin: "*", // Ganti dengan domain frontend-mu
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization",
}));

app.use(express.json());

app.use('/users', usersRouter);
app.use('/', adminRouter);

app.listen(4000, () => {
    console.log("server berjalan di port 4000");
});

module.exports = app;