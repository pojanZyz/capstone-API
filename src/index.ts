const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors({
    origin: "*", // Mengizinkan semua origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Metode yang diizinkan
    allowedHeaders: ["Content-Type"] // Header yang diizinkan
}));
const usersRouter = require("./router/users");
const adminRouter = require("./router/admin");


const dotenv = require("dotenv");                            

dotenv.config();

app.use(express.json());

app.use('/users', usersRouter);
app.use('/', adminRouter);

app.listen(4000, () => {
    console.log("server berjalan di port 4000");
});

module.exports = app;