import { BaseResp } from "../BaseResp"
import { Category } from "./Category"

export interface GetCatgeorysResp extends BaseResp {
    outputSchema: Category[]
}