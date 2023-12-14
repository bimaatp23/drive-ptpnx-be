import express, { Response } from "express"
import { QueryError } from "mysql2"
import { BaseResp } from "../../src/types/BaseResp"
import * as DataModel from "../models/DataModel"
import { JWTRequest } from "../types/JWTRequest"
import { errorResp } from "../utils/Response"
import { authenticateJWT } from "./AuthMiddleware"
import DataParser from "./DataParser"

export const DataRouter = express.Router()

DataRouter.post("/", authenticateJWT, DataParser.none(), async (req: JWTRequest, res: Response) => {
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

DataRouter.get("/:id", authenticateJWT, async (req: JWTRequest, res: Response) => {
    DataModel.download(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else if (resp.errorSchema.errorCode === 200) res.download((process.env.SERVER === "production" ? "./dist" : ".") + `/src/uploads/${resp.outputSchema.file}`)
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})