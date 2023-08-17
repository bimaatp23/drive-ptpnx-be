import { BaseResp } from '../BaseResp'
import { User } from './User'

export interface GetUsersResp extends BaseResp {
    outputSchema: User[]
}