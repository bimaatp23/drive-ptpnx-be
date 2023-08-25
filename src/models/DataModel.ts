import mysql, { RowDataPacket } from 'mysql2'
import { dbConfig } from '../../db'
import { JWTRequest } from '../types/JWTRequest'
import { Data } from '../types/data/Data'
import { GetDatasResp } from '../types/data/GetDatasResp'
import { TimestampToDate } from '../utils/DateMaker'
import { GetDatasReq } from '../types/data/GetDatasReq'

export const getData = (req: JWTRequest, callback: Function) => {
    const db = mysql.createConnection(dbConfig)
    const getDataReq: GetDatasReq = req.body
    db.query(
        `SELECT * FROM data WHERE 
            kategori = '${getDataReq.kategori}' AND 
            tanggal >= '${new Date(getDataReq.tanggalFrom).getTime() / 1000}' AND
            tanggal <= '${new Date(getDataReq.tanggalUntil).getTime() / 1000}' AND
            no_dokumen LIKE '%${getDataReq.noDokumen}%' AND 
            keterangan LIKE '%${getDataReq.keterangan}%' AND 
            author = '${req.payload?.username}'
            ORDER BY tanggal DESC`,
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]> result)
                const datas: Data[] = row.map((data) => {
                    return {
                        tanggal: TimestampToDate(data.tanggal),
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
                        errorMessage: 'Get Data Success'
                    },
                    outputSchema: datas
                } as GetDatasResp)
            }
            db.end()
        }
    )
}