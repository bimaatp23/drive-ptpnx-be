import express, {Request, Response} from 'express'
import * as userModel from '../models/userModel'
import { Users } from '../types/users'
const userRouter = express.Router()

userRouter.get('/', async (req: Request, res: Response) => {
    userModel.get(((err: Error, user: Users) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message})
        }
        res.status(200).json({'data': user})
    }))
})

export {userRouter}