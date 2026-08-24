import { Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt"
import { User } from "../models/User"
import { signToken } from "../utils/jwt"
import { AppError } from "../middleware/errorHandler"
import { logger } from "../config/logger"

const SALT_ROUNDS = 10

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            throw new AppError("Name, email and password are required", 400)
        }
        if (password.length < 6) {
            throw new AppError("Password must be at least 6 characters", 400)
        }

        const existing = await User.findOne({ where: { email } })
        if (existing) throw new AppError("An account with this email already exists", 409)

        const hashed = await bcrypt.hash(password, SALT_ROUNDS)
        const user = await User.create({ name, email, password: hashed })

        const token = signToken({ userId: user.id })
        logger.info({ userId: user.id }, "User signed up")

        res.status(201).json({
            token,
            user: { id: user.id, name: user.name, email: user.email },
        })
    } catch (err) {
        next(err)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body

        if (!email || !password) throw new AppError("Email and password are required", 400)

        const user = await User.findOne({ where: { email } })
        if (!user) throw new AppError("Invalid credentials", 401)

        const match = await bcrypt.compare(password, user.password)
        if (!match) throw new AppError("Invalid credentials", 401)

        const token = signToken({ userId: user.id })
        logger.info({ userId: user.id }, "User logged in")

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email },
        })
    } catch (err) {
        next(err)
    }
}

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.userId, { attributes: ["id", "name", "email", "createdAt"] })
        if (!user) throw new AppError("User not found", 404)

        res.json({ user })
    } catch (err) {
        next(err)
    }
}
