import express, { Response } from "express"
import { QueryError } from "mysql2"
import * as EmployeeModel from "../models/EmployeeModel"
import { BaseResp } from "../types/BaseResp"
import { JWTRequest } from "../types/JWTRequest"
import { errorResp } from "../utils/Response"
import { authenticateJWT } from "./AuthMiddleware"
import DataParser from "./DataParser"

export const EmployeeRouter = express.Router()

EmployeeRouter.get("/", authenticateJWT, async (req: JWTRequest, res: Response) => {
    EmployeeModel.getEmployees(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

EmployeeRouter.post("/", authenticateJWT, DataParser.none(), async (req: JWTRequest, res: Response) => {
    EmployeeModel.create(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

EmployeeRouter.put("/:id", authenticateJWT, DataParser.none(), async (req: JWTRequest, res: Response) => {
    EmployeeModel.update(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

EmployeeRouter.delete("/:id", authenticateJWT, async (req: JWTRequest, res: Response) => {
    EmployeeModel.remove(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})