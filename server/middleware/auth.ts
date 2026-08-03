import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt"

declare global {
    namespace Express {
        interface Request {
            userId?: number
        }
    }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null

    if (!token) return res.status(401).json({ message: "Authentication required" })

    try {
        const payload = verifyToken(token)
        req.userId = payload.userId
        next()
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}
