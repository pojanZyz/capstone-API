import { NextFunction, Request, Response } from "express";
const {adminValidation} = require("../middleware/adminValidation.ts");
const {accessValidation} = require("../middleware/accessValidation.ts");
const {createNewUser,getAllUsers,updateUser,deleteUser} = require("../controller/admin.ts");
import express from "express";

const jwt = require("jsonwebtoken");

const app = express.Router();

// CREATE USE ACC
app.post('/create', accessValidation, adminValidation, createNewUser);

// GET ALL USER ACC
app.get('/get', accessValidation, adminValidation, getAllUsers);

// UPDATE USER ACC
app.patch('/update/:id', accessValidation, adminValidation, updateUser);

// DELETE USER ACC
app.delete('/delete/:id', accessValidation, adminValidation, deleteUser)

module.exports = app;