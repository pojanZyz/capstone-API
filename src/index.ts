import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const app = express();
const router = express.Router();
app.use(express.json()); 

interface UserData {
    id: string,
    name: string,
    role: string
}

interface ValidationRequest extends Request{
    headers: {
        authorization: string;
    }
    userData : UserData
}

const adminValidation = (req: ValidationRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "ACCESS DENIED" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) ;

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "FORBIDDEN: Admin Only" });
        }

        req.userData = decoded as UserData;
        next();
    } catch (error) {
        res.status(403).json({ message: "INVALID TOKEN" });
    }
};


const accessValidation = (req,res,next)=>{
    const validationReq = req as ValidationRequest;
    const {authorization} = validationReq.headers;
    if(!authorization){
        res.status(401).json({
            message: "Token Diperlukan"
        })
        return;
    }

    const token = authorization.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    try {
        const jwtDecode = jwt.verify(token, secret);

        validationReq.userData = jwtDecode as UserData;
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized"
        })
        return;
    }
    next();
}

// REGISTER
router.post('/register', async(req,res)=>{
    try {
        const {name,password,email} = req.body;
        const hashedPass = await bcrypt.hash(password, 10);
        const result = await prisma.users.create({
            data: {name,password : hashedPass,email,role: "user"}
        })
        res.json({
            message: "REGISTER IS SUCCESS",
            data: result
        })
    } catch (error) {
        res.json({
            message: "REGISTER IS UNSUCCESS",
            data: error
        })
    }
})

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.users.findUnique({
        where: { email: email }
    });

    if (!user) {
        res.status(404).json({ message: "USER NOT FOUND" });
        return;
    }
    if (!user?.password) {
        res.status(404).json({ message: "PASSWORD NOT SET" });
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
        const payload ={
            data: {
                id: user.id,
                name: user.name,
                role: user.role
            }
        };

        const secret = process.env.JWT_SECRET!;
        const expired = 60 * 60 * 1;
        const token = jwt.sign(payload, secret, {expiresIn: expired})

        if(user.role === "admin"){
            res.json({
                message: "Login admin successful",
                role: "admin",
                data: payload,
                token: token
            });
            return
        }else{
            res.json({
                message: "Login user successful",
                role: "user",
                data: payload,
                token: token
            });
            return
        }
    }else{
        res.status(401).json({ message: "WRONG PASSWORD" });
        return;
    }

});

// create - ROLE ADMIN
router.post('/users', accessValidation, async(req,res)=>{
    try {
        const {name,password,email} = req.body;
        const result = await prisma.users.create({data :{name,password,email,role: "user"}})
        res.json({
            data : result,
            message : "CREATE USER SUCCESS"
        })
    } catch (error) {
        res.json({
            message: "CREATE USER UNSUCCESS",
            error: error
        })
    }
})

// READ - ROLE ADMIN
router.get('/users', accessValidation, async(req,res)=>{
    try {
        const result = await prisma.users.findMany();
        res.json({
            message:"GET ALL USERS SUCCESS",
            data : result
        })
    } catch (error) {
        res.json({
            message: "GET ALL USER UNSUCCESS",
            error: error
        })
    }
})

// UPDATE - ROLE ADMIN
router.patch('/users/update/:id', accessValidation, async(req,res)=>{
    try {
        const {id} = req.params;
        const {name,password,email} = req.body;

        const hashedPass = await bcrypt.hash(password, 10);
        const result = await prisma.users.update({
            where: {id : parseInt(id)},
            data : {name,password : hashedPass,email}
        })
        res.json({
            message: "UPDATE USER SUCCESS",
            data : result
        })
    } catch (error) {
        res.json({
            message: "UPDATE USER UNSUCCESS",
            error : error
        })
    }
    
})

// DELETE
router.delete('/users/:id', accessValidation, async(req,res)=>{
    try {
        const {id} = req.params;
        const result = await prisma.users.delete({
            where: {id: parseInt(id)}
        })
        // RESET A.I (Auto Increment)
        await prisma.$executeRaw`SET @num := 0;`;
        await prisma.$executeRaw`UPDATE users SET id = (@num := @num + 1);`;
        await prisma.$executeRaw`ALTER TABLE users AUTO_INCREMENT = 1;`;

        res.json({
            message: "DELETE USER SUCCESS",
            data : result
        })
    } catch (error) {
        res.json({
            message: "DELETE USER UNSUCCESS",
            error: error
        })
    }
})

app.use('/api', router);

app.listen(4000, ()=>{
    console.log("server berjalan di port 4000")
})