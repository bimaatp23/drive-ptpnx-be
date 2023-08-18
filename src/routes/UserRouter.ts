import express, { Request, Response } from 'express'
import { QueryError } from 'mysql2'
import { BaseResp } from '../../src/types/BaseResp'
import * as UserModel from '../models/UserModel'
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
const UserRouter = express.Router()

UserRouter.post('/login', DataParser.single('file'), async (req: Request, res: Response) => {
    const request: LoginReq = req.body
    UserModel.login(request, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResponse(err).errorSchema.errorCode).json(errorResponse(err))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

UserRouter.get('/all', authenticateJWT, async (req: Request, res: Response) => {
    UserModel.getAll(((err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResponse(err).errorSchema.errorCode).json(errorResponse(err))
        else res.status(resp.errorSchema.errorCode).json(resp)
    }))
})

export { UserRouter }

