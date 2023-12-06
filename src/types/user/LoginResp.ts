import { BaseResp } from "../BaseResp"
import { User } from "./User"

export interface LoginResp extends BaseResp {
    outputSchema: OutputSchema
}

export interface OutputSchema extends User {
    token: string
}