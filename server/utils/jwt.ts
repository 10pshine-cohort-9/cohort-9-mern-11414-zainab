import jwt from "jsonwebtoken"

export interface TokenPayload {
    userId: number
}

export const signToken = (payload: TokenPayload): string =>
    jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
    })

export const verifyToken = (token: string): TokenPayload =>
    jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload
