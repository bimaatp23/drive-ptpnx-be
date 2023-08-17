import express, { Request, Response } from 'express'
import { QueryError } from 'mysql2'
import { BaseResp } from '../../src/types/BaseResp'
import * as userModel from '../models/UserModel'
import { LoginReq } from '../types/user/LoginReq'
import { authenticateJWT } from './AuthMiddleware'
import DataParser from './DataParser'

const errorResponse = (err: QueryError): BaseResp => {
    return {
        errorSchema: {
            errorCode: 500,
            errorMessage: err.message
        }
    }
}
const userRouter = express.Router()

userRouter.post('/login', DataParser.single('file'), async (req: Request, res: Response) => {
    const request: LoginReq = req.body
    userModel.login(request, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResponse(err).errorSchema.errorCode).json(errorResponse(err))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

userRouter.get('/all', authenticateJWT, async (req: Request, res: Response) => {
    userModel.getAll(((err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResponse(err).errorSchema.errorCode).json(errorResponse(err))
        else res.status(resp.errorSchema.errorCode).json(resp)
    }))
})

export { userRouter }

