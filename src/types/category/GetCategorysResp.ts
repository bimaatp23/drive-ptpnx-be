import { BaseResp } from "../BaseResp"
import { Category } from "./Category"

export interface GetCategorysResp extends BaseResp {
    outputSchema: GetCategory[]
}

export interface GetCategory extends Category {
    usageCount: number
}