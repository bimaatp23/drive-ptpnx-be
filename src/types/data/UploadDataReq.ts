export interface UploadDataReq {
    date: string
    documentNumber: string
    description: string
    categoryId: string
    lockerId: string
    file: File | undefined
}