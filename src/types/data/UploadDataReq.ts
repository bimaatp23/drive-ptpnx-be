export interface UploadDataReq {
    tanggal: string
    noDokumen: string
    keterangan: string
    kategori: string
    file: File | undefined
}