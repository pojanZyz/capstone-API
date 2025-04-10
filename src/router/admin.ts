const {adminValidation} = require("../middleware/adminValidation");
const {accessValidation} = require("../middleware/accessValidation");
const {createNewUser,getAllUsers,updateUser,deleteUser,getUserById} = require("../controller/admin");
const upload = require('../middleware/upload'); // Import middleware upload
import express from "express";

const jwt = require("jsonwebtoken");

const app = express.Router();

// CREATE USE ACC
app.post('/create', upload.single('image'), accessValidation, adminValidation, createNewUser);

// GET ALL USER ACC
app.get('/get', accessValidation, adminValidation, getAllUsers);

// GET USER BY ID
app.get('/get/:id', accessValidation, adminValidation, getUserById )

// UPDATE USER ACC
app.patch('/update/:id', upload.single('image'), accessValidation, adminValidation, updateUser);

// DELETE USER ACC
app.delete('/delete/:id', accessValidation, adminValidation, deleteUser)

module.exports = app;