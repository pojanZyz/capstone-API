const usersRouter = require("./router/users");
const adminRouter = require("./router/admin");
const articleRouter = require("./router/article");
const ratingRouter = require("./router/rating");
const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");                                
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors({
  origin: '*', // Atau ganti dengan origin spesifik seperti 'http://127.0.0.1:5500'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors()); // Tangani preflight request
app.use(express.json());

app.use('/users', usersRouter);
app.use('/', adminRouter, articleRouter, ratingRouter);

app.listen(4000, () => {
    console.log("server berjalan di port 4000");
});

module.exports = app;