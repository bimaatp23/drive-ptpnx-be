import { BaseResp } from "../types/BaseResp"

export const baseResp = (code: number, message?: string, result?: any): BaseResp => {
    return result ?
        {
            errorSchema: {
                errorCode: 200,
                errorMessage: message ?? "OK"
            },
            outputSchema: result
        }
        :
        {
            errorSchema: {
                errorCode: code,
                errorMessage: message ?? "OK"
            }
        }
}

export const badRequestResp = (message?: string): BaseResp => {
    return {
        errorSchema: {
            errorCode: 400,
            errorMessage: message ?? "Bad Request"
        }
    }
}

export const unauthorizedResp = (message?: string): BaseResp => {
    return {
        errorSchema: {
            errorCode: 401,
            errorMessage: message ?? "Unauthorized"
        }
    }
}

export const invalidTokenResp = (message?: string): BaseResp => {
    return {
        errorSchema: {
            errorCode: 402,
            errorMessage: message ?? "Invalid Token"
        }
    }
}

export const notFoundResp = (message?: string): BaseResp => {
    return {
        errorSchema: {
            errorCode: 404,
            errorMessage: message ?? "Not Found"
        }
    }
}

export const errorResp = (message: string): BaseResp => {
    return {
        errorSchema: {
            errorCode: 500,
            errorMessage: message ?? "Internal Server Error"
        }
    }
}