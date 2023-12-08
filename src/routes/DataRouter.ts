import express, { Response } from "express"
import { QueryError } from "mysql2"
import { BaseResp } from "../../src/types/BaseResp"
import * as DataModel from "../models/DataModel"
import { JWTRequest } from "../types/JWTRequest"
import { errorResp } from "../utils/Response"
import { authenticateJWT } from "./AuthMiddleware"
import DataParser from "./DataParser"

export const DataRouter = express.Router()

DataRouter.post("/", authenticateJWT, async (req: JWTRequest, res: Response) => {
    DataModel.getData(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

DataRouter.post("/upload", authenticateJWT, DataParser.single("file"), async (req: JWTRequest, res: Response) => {
    DataModel.upload(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})