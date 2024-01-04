import { BaseResp } from "../BaseResp"
import { Employee } from "./Employee"

export interface GetEmployeesResp extends BaseResp {
    outputSchema: Employee[]
}