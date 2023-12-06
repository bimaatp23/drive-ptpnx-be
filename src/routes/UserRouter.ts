import express, { Response } from "express"
import { QueryError } from "mysql2"
import { BaseResp } from "../../src/types/BaseResp"
import * as UserModel from "../models/UserModel"
import { JWTRequest } from "../types/JWTRequest"
import { authenticateJWT } from "./AuthMiddleware"
import DataParser from "./DataParser"

const errorResponse = (err: QueryError): BaseResp => {
    return {
        errorSchema: {
            errorCode: 500,
            errorMessage: err.message
        }
    }
}

export const UserRouter = express.Router()

UserRouter.post("/login", DataParser.single("file"), async (req: JWTRequest, res: Response) => {
    UserModel.login(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResponse(err).errorSchema.errorCode).json(errorResponse(err))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

UserRouter.post("/change-password", authenticateJWT, DataParser.single("file"), async (req: JWTRequest, res: Response) => {
    UserModel.changePassword(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResponse(err).errorSchema.errorCode).json(errorResponse(err))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

UserRouter.get("/all", authenticateJWT, async (req: JWTRequest, res: Response) => {
    UserModel.getAll(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResponse(err).errorSchema.errorCode).json(errorResponse(err))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})