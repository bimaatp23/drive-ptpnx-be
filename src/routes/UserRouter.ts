import express, { Request, Response } from 'express'
import * as userModel from '../models/UserModel'
import { BaseResp } from '../../src/types/BaseResp'
import { GetUsersResp } from '../../src/types/user/GetUsersResp'
const userRouter = express.Router()

const errorResponse = (code: number, message: string): BaseResp => {
    return {
        errorSchema: {
            errorCode: code,
            errorMessage: message
        }
    }
}

userRouter.get('/all', async (req: Request, res: Response) => {
    userModel.getAll(((err: Error, resp: GetUsersResp) => {
        if (err) {
            return res.status(500).json(errorResponse(500, err.message))
        }
        res.status(resp.errorSchema.errorCode).json(resp)
    }))
})

export { userRouter }
