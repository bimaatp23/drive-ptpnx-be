import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { BaseResp } from '../types/BaseResp'

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1]
  if (!token) {
    return res.status(401).json({
        errorSchema: {
            errorCode: 401,
            errorMessage: 'Authentication failed'
        }
    } as BaseResp)
  }

  jwt.verify(token, 'NikenPuspitaLarasati27072001', (err, user) => {
    if (err) {
        return res.status(403).json({
            errorSchema: {
                errorCode: 403,
                errorMessage: 'Invalid token'
            }
        } as BaseResp)
    }

    next()
  })
}