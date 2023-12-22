import express, { Response } from "express"
import { QueryError } from "mysql2"
import * as CategoryModel from "../models/CategoryModel"
import { BaseResp } from "../types/BaseResp"
import { JWTRequest } from "../types/JWTRequest"
import { errorResp } from "../utils/Response"
import { authenticateJWT } from "./AuthMiddleware"
import DataParser from "./DataParser"

export const CategoryRouter = express.Router()

CategoryRouter.get("/", authenticateJWT, async (req: JWTRequest, res: Response) => {
    CategoryModel.getCategorys(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

CategoryRouter.post("/", DataParser.none(), async (req: JWTRequest, res: Response) => {
    CategoryModel.create(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

CategoryRouter.put("/:id", DataParser.none(), async (req: JWTRequest, res: Response) => {
    CategoryModel.update(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})

CategoryRouter.delete("/:id", async (req: JWTRequest, res: Response) => {
    CategoryModel.remove(req, (err: QueryError, resp: BaseResp) => {
        if (err) return res.status(errorResp(err.message).errorSchema.errorCode).json(errorResp(err.message))
        else res.status(resp.errorSchema.errorCode).json(resp)
    })
})