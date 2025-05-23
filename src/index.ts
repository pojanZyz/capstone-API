const usersRouter = require("./router/users");
const adminRouter = require("./router/admin");
const articleRouter = require("./router/article");
const ratingRouter = require("./router/rating");
const express = require("express");
const fs = require('fs');
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");                                
const cors = require("cors");
const mlRouter = require("./router/ml");
const rekomenRouter = require("./router/rekomen");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', usersRouter);
app.use('/', adminRouter, articleRouter, ratingRouter, mlRouter, rekomenRouter);

app.listen(4000, () => {
    console.log("server berjalan di port 4000");
});

module.exports = app;