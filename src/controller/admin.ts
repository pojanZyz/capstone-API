// import type { NextFunction, Request, Response } from "express";
import express from "express";
const dotenv = require("dotenv");
const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
                       

dotenv.config();

const createNewUser = async (req : express.Request, res : express.Response) => {
    try {
        const { username, password, email } = req.body;
        const hashedPass = await bcrypt.hash(password, 10);
        const result = await prisma.users.create({ data: { username, password : hashedPass, email, role: "user" } });
        res.json({ message: "CREATE USER SUCCESS", data: result });
    } catch (error) {
        res.json({ message: "CREATE USER UNSUCCESS", error });
    }finally{
        await prisma.$disconnect();
    }
};

const getAllUsers =  async (req : express.Request, res : express.Response) => {
    try {
        const result = await prisma.users.findMany();
        res.json({ message: "GET ALL USERS SUCCESS", data: result });
    } catch (error) {
        res.json({ message: "GET ALL USER UNSUCCESS", error });
    }finally{
        await prisma.$disconnect();
    }
};

const getUserById = async (req: express.Request, res : express.Response)=>{
    try {
        const { id } = req.params;
        const data = await prisma.users.findByPk(id); // Cek database
        if (!data) return res.status(404).json({ error: 'Data tidak ditemukan' });
        res.json(data);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }finally{
        await prisma.$disconnect();
    }
}

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
    }finally{
        await prisma.$disconnect();
    }
};

const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        // Hapus user berdasarkan ID (Gunakan parameterized query untuk keamanan)
        await prisma.$executeRawUnsafe(`DELETE FROM users WHERE id = $1;`, Number(id));

        // Reset sequence ID agar mulai dari ID terkecil yang ada
        await prisma.$executeRawUnsafe(`
            SELECT setval(
                pg_get_serial_sequence('users', 'id'),
                COALESCE((SELECT MAX(id) FROM users), 1),
                false
            );
        `);

        res.json({ message: "DELETE USER SUCCESS" });

        // Bersihkan database (Gunakan tanpa FULL agar bisa berjalan di Prisma)
        await prisma.$queryRawUnsafe("VACUUM ANALYZE users;");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "DELETE USER UNSUCCESS", error });
    } finally {
        await prisma.$disconnect();
    }
};

module.exports = {createNewUser,getAllUsers,updateUser,deleteUser,getUserById};