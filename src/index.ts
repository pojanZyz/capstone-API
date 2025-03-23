const express = require("express");
const app = express();
const cors = require("cors");
const usersRouter = require("./router/users");
const adminRouter = require("./router/admin");


const dotenv = require("dotenv");                            

dotenv.config();
app.use(cors()); // Mengizinkan semua domain mengakses API

app.use(express.json());

app.use('/users', usersRouter);
app.use('/', adminRouter);

app.listen(4000, () => {
    console.log("server berjalan di port 4000");
});

module.exports = app;