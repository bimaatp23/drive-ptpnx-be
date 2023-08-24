import mysql, { RowDataPacket } from 'mysql2'
import { dbConfig } from '../../db'
import { JWTRequest } from '../types/JWTRequest'
import { Data } from '../types/data/Data'
import { GetDatasResp } from '../types/data/GetDatasResp'
import { TimestampToDate } from '../utils/DateMaker'

export const getAll = (req: JWTRequest, callback: Function) => {
    const db = mysql.createConnection(dbConfig)
    db.query(
        'SELECT * FROM data',
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
                        errorMessage: 'Get All Data Success'
                    },
                    outputSchema: datas
                } as GetDatasResp)
            }
            db.end()
        }
    )
}

export const getByCategory = (req: JWTRequest, callback: Function) => {
    const db = mysql.createConnection(dbConfig)
    db.query(
        'SELECT * FROM data WHERE kategori = ? AND author = ?',
        [req.params.kategori, req.payload?.username],
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
                        errorMessage: 'Get All Data Success'
                    },
                    outputSchema: datas
                } as GetDatasResp)
            }
            db.end()
        }
    )
}