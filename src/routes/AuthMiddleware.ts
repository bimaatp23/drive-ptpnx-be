import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import { BaseResp } from '../types/BaseResp'
import { JWTRequest } from '../types/JWTRequest'

export const authenticateJWT = (req: JWTRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1]
  if (!token) {
    return res.status(401).json({
        errorSchema: {
            errorCode: 401,
            errorMessage: 'Authentication failed'
        }
    } as BaseResp)
  }

  jwt.verify(token, process.env.SECRET_KEY as string, (err, payload) => {
    if (err) {
        return res.status(403).json({
            errorSchema: {
                errorCode: 403,
                errorMessage: 'Invalid token'
            }
        } as BaseResp)
    }

    req.payload = payload
    next()
  })
}