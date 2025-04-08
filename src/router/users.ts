const {register,login,logout,getUserLogin} = require("../controller/users");
const {accessValidation} = require("../middleware/accessValidation");
const upload = require('../middleware/upload'); 
import express from "express";

const app = express.Router();

//  REGISTER
app.post('/register', upload.single('image'), register);

// LOGIN
app.post('/login', login);

// LOGOUT
app.post('/logout', accessValidation, logout);

// GET DATA USER LOGIN
app.get('/me', accessValidation, getUserLogin);

module.exports = app;