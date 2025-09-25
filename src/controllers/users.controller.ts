import { Request, Response } from "express";
import { UsersModel } from "../models/users.model";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Result } from "pg";

const JWT_SECRET = process.env.JWT_SECRET as string

export const getUsers = async (_req: Request, res: Response) => {
    try {
        const users = await UsersModel.getAll()

        res.status(200).json({
            result: users
        })
    } catch (err) {
        res.status(500).json({ message: "Error get users", err })
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Wajib ada ID" })
        }
        const id = parseInt(req.params.id)
        const user = await UsersModel.getById(id)

        if (!user) {
            return res.status(404).json({ message: "User Not Found" })
        }

        res.status(200).json({
            message: "User Found",
            result: user
        })
    } catch (err) {
        res.status(500).json({ message: "Error get user" })
    }
}


export const updateUser = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Wajib ada ID" })
        }
        const id = parseInt(req.params.id)
        const updateUser = await UsersModel.updateUser(id, req.body)
        res.status(201).json({
            statusCode: 201,
            message: "Data Updated Successfully",
            results: updateUser
        })
    } catch (err) {
        res.status(500).json({ error: "Error Update Products", message: err })
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({message: "Wajib ada ID"})
        }
        const id = parseInt(req.params.id)
        const deleted = await UsersModel.deleteUser(id)

        res.status(200).json({
            message: "User Deleted Succesfully",
            data: deleted,
        })
    } catch (err) {
        res.status(500).json({message: "Error Get Product", err})
    }
}

export const registerUser = async (req: Request, res: Response) => {
    try {
        const {username, role, password} = req.body

        const checkUser = await UsersModel.getByUsername(username)

        if(checkUser) {
            return res.status(400).json({
                message: `User dengan ${username} sudah ada`
            })
        }

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const newUser = await UsersModel.createUser({
            username: username,
            role: role,
            password: hashedPassword
        })

        res.status(201).json({
            ststusCode: 201,
            message: "User Created Succesfully",
            result: newUser,
        })

    } catch (err) {
        res.status(500).json({ error: "Error Create User", message: err })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({message: "Username atau Password tidak boleh kosong"})
        }

        const { username, password} = req.body
        const user = await UsersModel.getByUsername(username)

        if (!user) {
            return res.status(401).json({message: "Username atau Password salah"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(404).json({ message: "Username atau Password salah"})
        }

        const token = jwt.sign({id: user?.id, username: user?.username, role: user?.role}, JWT_SECRET, {
            expiresIn: "2 Days"
        })
        res.status(201).json({
            statusCode: 201,
            message: "User Login Succesfuly",
            result: {
                id: user?.id,
                username: user?.username,
                role: user?.role,
                token: token
            },
        })
    } catch (err) {
        res.status(500).json({ error: "Error login User", message: err})
        console.log(err)
    }
}