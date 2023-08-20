import { Request } from 'express'

export interface JWTRequest extends Request {
    payload?: {
        name: string,
        role: string,
        username: string,
        iat: number,
        exp: number
    }
}