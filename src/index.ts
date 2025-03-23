import { Request, Response, NextFunction } from "express";
const express = require("express");
const app = express();
const cors = require("cors");
const usersRouter = require("./router/users");
const adminRouter = require("./router/admin");


const dotenv = require("dotenv");                            

dotenv.config();
app.use(cors());

app.options('*', cors()); // Menangani preflight request

app.use((req : Request, res : Response, next : NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

app.use('/users', usersRouter);
app.use('/', adminRouter);

app.listen(4000, () => {
    console.log("server berjalan di port 4000");
});

module.exports = app;