import { Request } from 'express'

export interface JWTRequest extends Request {
    payload?: any
}