import { BaseResp } from "../BaseResp"
import { Category } from "./Category"

export interface GetCategorysResp extends BaseResp {
    outputSchema: GetCategorys[]
}

export interface GetCategorys extends Category {
    usageCount: number
}