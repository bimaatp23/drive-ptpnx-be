import express, { Response } from "express"
import { QueryError } from "mysql2"
import * as LockerModel from "../models/LockerModel"
import { BaseResp } from "../types/BaseResp"
import { JWTRequest } from "../types/JWTRequest"
import { errorResp } from "../utils/Response"
import { authenticateJWT } from "./AuthMiddleware"
import DataParser from "./DataParser"

export const LockerRouter = express.Router()

LockerRouter.get("/", authenticateJWT, async (req: JWTRequest, res: Response) => {
    LockerModel.getLockers(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

LockerRouter.post("/create", DataParser.none(), async (req: JWTRequest, res: Response) => {
    LockerModel.create(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

LockerRouter.post("/update", DataParser.none(), async (req: JWTRequest, res: Response) => {
    LockerModel.update(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

LockerRouter.post("/delete", DataParser.none(), async (req: JWTRequest, res: Response) => {
    LockerModel.remove(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})