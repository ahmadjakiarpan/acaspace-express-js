import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { Users } from "../models/users.model"

const JWT_SECRET = process.env.JWT_SECRET as string

export interface AuthRequest extends Request {
    user?: any
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if(!authHeader) {
        return res.status(401).json({message: "unauthorized"})
    }

    const token = authHeader.split(" ")[1] as string

    try {
        const decode = jwt.verify(token, JWT_SECRET)
        req.user = decode
        next()
    } catch (err) {
        return res.status(403).json({message: "token tidak valid"})
    }

}

export const roleMiddleware = (role: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({message: "User belum login"})
        }
        if(req.user.role !== role) {
            return res.status(403).json({message: "Akses ditolak, Role tidak sesuai"})
        }
        next()
    }
}