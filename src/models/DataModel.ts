import * as fs from "fs"
import mysql, { Connection, RowDataPacket } from "mysql2"
import path from "path"
import { dbConfig } from "../../db"
import { JWTRequest } from "../types/JWTRequest"
import { Data } from "../types/data/Data"
import { GetDatasReq } from "../types/data/GetDatasReq"
import { GetDatasResp } from "../types/data/GetDatasResp"
import { UploadDataReq } from "../types/data/UploadDataReq"
import { TimestampToDate } from "../utils/DateMaker"
import { badRequestResp, baseResp, errorResp } from "../utils/Response"
import { generateUUID } from "../utils/UUID"

export const getData = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const getDataReq: GetDatasReq = req.body
    db.query(
        `SELECT * FROM data WHERE 
            kategori = "${getDataReq.kategori}" AND 
            tanggal >= "${new Date(getDataReq.tanggalFrom).getTime() / 1000}" AND
            tanggal <= "${new Date(getDataReq.tanggalUntil).getTime() / 1000}" AND
            no_dokumen LIKE "%${getDataReq.noDokumen}%" AND 
            keterangan LIKE "%${getDataReq.keterangan}%" AND 
            author = "${req.payload?.username}"
            ORDER BY tanggal DESC`,
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
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
                callback(null, baseResp(200, "Get Data Success", datas) as GetDatasResp)
            }
            db.end()
        }
    )
}

export const upload = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const uploadDataReq: UploadDataReq = req.body
    const payload = req.payload
    const file = req.file
    const uuid = generateUUID()
    console.log(uuid)
    if (file && payload) {
        db.query(
            "INSERT INTO `data` VALUES (?, ?, ?, ?, ?, ?, ?)",
            [uuid, uploadDataReq.tanggal, uploadDataReq.noDokumen, uploadDataReq.keterangan, uploadDataReq.kategori, uuid + path.extname(file.filename), payload.username],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    const sourcePath = path.join((process.env.SERVER === "production" ? "./dist" : ".") + "/src/uploads/temp/", file.filename)
                    const destinationPath = path.join((process.env.SERVER === "production" ? "./dist" : ".") + "/src/uploads/temp/", uuid + path.extname(file.filename))
                    fs.renameSync(sourcePath, destinationPath)
                    callback(null, baseResp(200, "Upload success"))
                }
                db.end()
            }
        )
    } else {
        callback(null, badRequestResp())
    }
}