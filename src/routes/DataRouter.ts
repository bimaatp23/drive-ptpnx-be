import express, { Response } from 'express'
import { QueryError } from 'mysql2'
import { BaseResp } from '../../src/types/BaseResp'
import * as DataModel from '../models/DataModel'
import { JWTRequest } from '../types/JWTRequest'
import { authenticateJWT } from './AuthMiddleware'

const errorResponse = (err: QueryError): BaseResp => {
    return {
        errorSchema: {
            errorCode: 500,
            errorMessage: err.message
        }
    }
}
const DataRouter = express.Router()

DataRouter.get('/all', authenticateJWT, async (req: JWTRequest, res: Response) => {
    DataModel.getAll(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResponse(err).errorSchema.errorCode).json(errorResponse(err))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

DataRouter.get('/all/:kategori', authenticateJWT, async (req: JWTRequest, res: Response) => {
    DataModel.getByCategory(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResponse(err).errorSchema.errorCode).json(errorResponse(err))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

export { DataRouter }

