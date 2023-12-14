import express, { Response } from "express"
import { QueryError } from "mysql2"
import { BaseResp } from "../../src/types/BaseResp"
import * as UserModel from "../models/UserModel"
import { JWTRequest } from "../types/JWTRequest"
import { errorResp } from "../utils/Response"
import { authenticateJWT } from "./AuthMiddleware"
import DataParser from "./DataParser"

export const UserRouter = express.Router()

UserRouter.get("/all", authenticateJWT, async (req: JWTRequest, res: Response) => {
    UserModel.getUsers(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

UserRouter.post("/login", DataParser.none(), async (req: JWTRequest, res: Response) => {
    UserModel.login(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

UserRouter.post("/change-password", authenticateJWT, DataParser.none(), async (req: JWTRequest, res: Response) => {
    UserModel.changePassword(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})