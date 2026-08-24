import { Request, Response, NextFunction } from "express"
import { logger } from "../config/logger"

export class AppError extends Error {
    statusCode: number

    constructor(message: string, statusCode = 400) {
        super(message)
        this.statusCode = statusCode
    }
}

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500
    const message = statusCode === 500 ? "Something went wrong" : err.message

    logger.error({ err, path: req.originalUrl, method: req.method }, err.message)

    res.status(statusCode).json({ message })
}
