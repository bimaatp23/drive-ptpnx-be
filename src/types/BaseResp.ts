export interface BaseResp {
    errorSchema: {
        errorCode: number
        errorMessage: string
    }
    outputSchema?: any 
}