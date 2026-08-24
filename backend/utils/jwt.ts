import jwt from "jsonwebtoken"

export interface TokenPayload {
    userId: number // I store the user's ID in the token so I know which user is logged in.
}

export const signToken = (payload: TokenPayload): string =>
    jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
    })
// I create a token after login so the user can prove they are authenticated in future requests.

export const verifyToken = (token: string): TokenPayload =>
    jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload
// I check whether the token is valid and get the user's ID from it so I know who is making the request.
