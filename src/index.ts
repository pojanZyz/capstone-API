const usersRouter = require("./router/users");
const adminRouter = require("./router/admin");
const articleRouter = require("./router/article");

const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");                                
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors()); // Mengizinkan semua domain mengakses API
app.use(express.json());

app.use('/users', usersRouter);
app.use('/', adminRouter, articleRouter);

app.listen(4000, () => {
    console.log("server berjalan di port 4000");
});

module.exports = app;