import { RowDataPacket } from "mysql2"
import { db } from "../../db"
import { Data } from "../types/data/Data"
import { GetDatasResp } from "../types/data/GetDatasResp"

export const getAll = (callback: Function) => {
    db.query(
        'SELECT * FROM data',
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]> result)
                const datas: Data[] = row.map((data) => {
                    return {
                        tanggal: data.tanggal,
                        noDokumen: data.no_dokumen,
                        keterangan: data.keterangan,
                        file: data.file,
                        kategori: data.kategori,
                        author: data.author,
                    }
                })
                callback(null, {
                    errorSchema: {
                        errorCode: 200,
                        errorMessage: 'Get All Data Success'
                    },
                    outputSchema: datas
                } as GetDatasResp)
            }
        }
    )
}