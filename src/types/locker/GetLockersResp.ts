import { BaseResp } from "../BaseResp"
import { Locker } from "./Locker"

export interface GetLockersResp extends BaseResp {
    outputSchema: GetLocker[]
}

export interface GetLocker extends Locker {
    usageCount: number
}