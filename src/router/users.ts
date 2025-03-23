const {register,login,logout,getUserLogin} = require("../controller/users");
const {accessValidation} = require("../middleware/accessValidation")
import express from "express";
const jwt = require("jsonwebtoken");

const router = express.Router();


//  REGISTER
router.post('/register', register);

// LOGIN
router.post('/login', login);

// LOGOUT
router.post('/logout', accessValidation, logout);

// GET DATA USER LOGIN
router.get('/me', accessValidation, getUserLogin);

module.exports = router;