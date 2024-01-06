import express, { Response } from "express"
import { QueryError } from "mysql2"
import * as LoanModel from "../models/LoanModel"
import { BaseResp } from "../types/BaseResp"
import { JWTRequest } from "../types/JWTRequest"
import { errorResp } from "../utils/Response"
import DataParser from "./DataParser"

export const LoanRouter = express.Router()

LoanRouter.get("/", async (req: JWTRequest, res: Response) => {
    LoanModel.getLoans(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

LoanRouter.post("/", DataParser.none(), async (req: JWTRequest, res: Response) => {
    LoanModel.create(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

LoanRouter.put("/:id", DataParser.none(), async (req: JWTRequest, res: Response) => {
    LoanModel.update(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

LoanRouter.delete("/:id", async (req: JWTRequest, res: Response) => {
    LoanModel.remove(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})