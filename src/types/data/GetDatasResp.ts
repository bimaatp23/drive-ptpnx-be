import { BaseResp } from '../BaseResp'
import { Data } from './Data'

export interface GetDatasResp extends BaseResp {
    outputSchema: Data[]
}