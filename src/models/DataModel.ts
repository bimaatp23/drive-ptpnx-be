import * as fs from "fs"
import mysql, { Connection, RowDataPacket } from "mysql2"
import path from "path"
import { dbConfig } from "../../db"
import { JWTRequest } from "../types/JWTRequest"
import { Data } from "../types/data/Data"
import { GetDatasReq } from "../types/data/GetDatasReq"
import { GetDatasResp } from "../types/data/GetDatasResp"
import { UploadDataReq } from "../types/data/UploadDataReq"
import { badRequestResp, baseResp, errorResp } from "../utils/Response"
import { generateUUID } from "../utils/UUID"

export const getData = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const getDataReq: GetDatasReq = req.body
    const payload = req.payload
    db.query(
        `SELECT * FROM data WHERE 
            kategori = ? AND 
            author = ?
            ORDER BY tanggal DESC`,
        [getDataReq.kategori, payload?.username],
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                let datas: Data[] = row.map((data) => {
                    return {
                        tanggal: data.tanggal,
                        noDokumen: data.no_dokumen,
                        keterangan: data.keterangan,
                        file: data.file,
                        kategori: data.kategori,
                        author: data.author,
                    }
                })
                datas = datas.filter((data) => data.noDokumen.toLowerCase().includes(getDataReq.noDokumen))
                datas = datas.filter((data) => data.keterangan.toLowerCase().includes(getDataReq.keterangan))
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