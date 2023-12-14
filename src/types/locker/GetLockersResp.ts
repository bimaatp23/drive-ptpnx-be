import { BaseResp } from "../BaseResp"
import { Locker } from "./Locker"

export interface GetLockersResp extends BaseResp {
    outputSchema: Locker[]
}