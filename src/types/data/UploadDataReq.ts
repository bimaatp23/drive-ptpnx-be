export interface UploadDataReq {
    date: string
    documentNumber: string
    description: string
    category: string
    file: File | undefined
}