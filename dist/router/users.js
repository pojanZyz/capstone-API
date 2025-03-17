"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { register, login, logout, getUserLogin } = require("../controller/users");
const { accessValidation } = require("../middleware/accessValidation");
const express_1 = __importDefault(require("express"));
const jwt = require("jsonwebtoken");
const app = express_1.default.Router();
//  REGISTER
app.post('/register', register);
// LOGIN
app.post('/login', login);
// LOGOUT
app.post('/logout', accessValidation, logout);
// GET DATA USER LOGIN
app.get('/me', accessValidation, getUserLogin);
module.exports = app;
