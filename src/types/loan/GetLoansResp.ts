import { BaseResp } from "../BaseResp"
import { Loan } from "./Loan"

export interface GetLoansResp extends BaseResp {
    outputSchema: Loan[]
}