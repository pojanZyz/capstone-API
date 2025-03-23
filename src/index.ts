import { Request, Response, NextFunction } from "express";
const express = require("express");
const app = express();
const cors = require("cors");
const usersRouter = require("./router/users");
const adminRouter = require("./router/admin");


const dotenv = require("dotenv");                            

dotenv.config();
app.use(cors({
    origin: "http://127.0.0.1:5500", // Ganti dengan domain frontend-mu
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true, // Jika frontend butuh mengirim cookie/token
}));


app.options("/", cors());

app.use(express.json());

app.use('/users', usersRouter);
app.use('/', adminRouter);

app.listen(4000, () => {
    console.log("server berjalan di port 4000");
});

module.exports = app;