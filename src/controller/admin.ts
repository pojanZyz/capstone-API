// import type { NextFunction, Request, Response } from "express";
import express from "express";
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");                                

dotenv.config();
const prisma = new PrismaClient();

const createNewUser = async (req : express.Request, res : express.Response) => {
    try {
        const { username, password, email } = req.body;
        const hashedPass = await bcrypt.hash(password, 10);
        const result = await prisma.users.create({ data: { username, password : hashedPass, email, role: "user" } });
        res.json({ message: "CREATE USER SUCCESS", data: result });
    } catch (error) {
        res.json({ message: "CREATE USER UNSUCCESS", error });
    }
};

const getAllUsers =  async (req : express.Request, res : express.Response) => {
    try {
        const result = await prisma.users.findMany();
        res.json({ message: "GET ALL USERS SUCCESS", data: result });
    } catch (error) {
        res.json({ message: "GET ALL USER UNSUCCESS", error });
    }
};

const updateUser =  async (req : express.Request, res : express.Response) => {
    const { id } = req.params;
    const { username, password, email } = req.body;

    try {
        const updateData:any = {};

        if (username) updateData.username = username;
        if (password) updateData.password = await bcrypt.hash(password, 10);
        if (email) updateData.email = email;

        const result = await prisma.users.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        res.json({ message: "UPDATE USER SUCCESS", data: result });
    } catch (error) {
        res.json({ message: "UPDATE USER UNSUCCESS", error });
    }
};

const deleteUser = async (req : express.Request, res : express.Response) => {
    try {
        const { id } = req.params;
        const result = await prisma.users.delete({ where: { id: parseInt(id) } });
        await prisma.$executeRaw`SET @num := 0;`;
        await prisma.$executeRaw`UPDATE users SET id = (@num := @num + 1);`;
        await prisma.$executeRaw`ALTER TABLE users AUTO_INCREMENT = 1;`;
        res.json({ message: "DELETE USER SUCCESS", data: result });
    } catch (error) {
        res.json({ message: "DELETE USER UNSUCCESS", error });
    }
};

module.exports = {createNewUser,getAllUsers,updateUser,deleteUser};