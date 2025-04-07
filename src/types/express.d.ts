// filepath: d:\Dicoding-indonesia\project-capstone\Express - Typescript\src\types\express.d.ts
import * as express from 'express';
import { Multer } from 'multer'; // Tidak perlu impor tipe File

declare global {
    namespace Express {
        interface Request {
            file?: Multer.File; // Properti untuk file tunggal
            files?: { [fieldname: string]: Multer.File[] } | Multer.File[]; // Properti untuk banyak file
        }
    }
}