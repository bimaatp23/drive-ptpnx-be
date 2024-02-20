import * as fs from "fs"
import mysql, { Connection, RowDataPacket } from "mysql2"
import path from "path"
import { dbConfig } from "../../db"
import { BaseResp } from "../types/BaseResp"
import { JWTRequest } from "../types/JWTRequest"
import { Data } from "../types/data/Data"
import { DeleteDataReq } from "../types/data/DeleteDataReq"
import { GetDatasReq } from "../types/data/GetDatasReq"
import { GetDatasResp } from "../types/data/GetDatasResp"
import { UpdateDataReq } from "../types/data/UpdateDataReq"
import { UploadDataReq } from "../types/data/UploadDataReq"
import { badRequestResp, baseResp, errorResp, notFoundResp } from "../utils/Response"
import { generateUUID } from "../utils/UUID"

export const getDatas = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const getDataReq: GetDatasReq = {
        categoryId: req.query.categoryId as string ?? "",
        lockerId: req.query.lockerId as string ?? "",
        dateFrom: req.query.dateFrom as string ?? "",
        dateUntil: req.query.dateUntil as string ?? "",
        documentNumber: req.query.documentNumber as string ?? "",
        description: req.query.description as string ?? ""
    }
    const payload = req.payload
    db.query(
        `SELECT * FROM data WHERE 
            category_id LIKE ? AND 
            locker_id LIKE ? AND 
        ${getDataReq.dateFrom === "" ?
            `date <= "${getDataReq.dateUntil}"`
            :
            getDataReq.dateUntil === "" ?
                `date >= "${getDataReq.dateFrom}"`
                :
                `date BETWEEN "${getDataReq.dateFrom}" AND "${getDataReq.dateUntil}"`
        } AND
            document_number LIKE ? AND 
            description LIKE ? AND 
            author = ?
            ORDER BY date DESC`,
        [`%${getDataReq.categoryId}%`, `%${getDataReq.lockerId}%`, `%${getDataReq.documentNumber}%`, `%${getDataReq.description}%`, payload?.username],
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                let datas: Data[] = row.map((data) => {
                    return {
                        id: data.id,
                        date: data.date,
                        documentNumber: data.document_number,
                        description: data.description,
                        file: data.file,
                        categoryId: data.category_id,
                        lockerId: data.locker_id,
                        author: data.author
                    }
                })
                if (datas.length > 0) {
                    datas = datas.filter((data) => data.documentNumber?.toLowerCase().includes(getDataReq.documentNumber))
                    datas = datas.filter((data) => data.description?.toLowerCase().includes(getDataReq.description))
                }
                callback(null, baseResp(200, "Berhasil Mendapatkan List Data", datas) as GetDatasResp)
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
    const uuid = req.body.uuid ?? generateUUID()
    if (file) {
        db.query(
            "INSERT INTO data VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [uuid, uploadDataReq.date, uploadDataReq.documentNumber, uploadDataReq.description, uploadDataReq.categoryId, uploadDataReq.lockerId, uuid + path.extname(file.filename), payload?.username],
            (err) => {
                if (err) {
                    callback(err, errorResp(err.message))
                } else {
                    const sourcePath = path.join((process.env.SERVER === "production" ? "./dist" : ".") + "/src/uploads/temp/", file.filename)
                    const destinationPath = path.join((process.env.SERVER === "production" ? "./dist" : ".") + "/src/uploads/", uuid + path.extname(file.filename))
                    try {
                        fs.renameSync(sourcePath, destinationPath)
                    } catch { }
                    callback(null, baseResp(200, "Berhasil Menambah Data"))
                }
                db.end()
            }
        )
    } else {
        callback(null, badRequestResp())
    }
}

export const download = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const fileId = req.params.id
    db.query(
        "SELECT * FROM data WHERE id = ?",
        [fileId],
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                if (row.length === 0) {
                    callback(null, notFoundResp("File Tidak Ditemukan"))
                } else {
                    callback(null, baseResp(200, "Berhasil Mengunduh Data", {
                        file: row[0].file
                    }) as BaseResp)
                }
            }
            db.end()
        }
    )
}

export const update = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const updateDataReq: UpdateDataReq = {
        ...req.body,
        id: req.params.id
    }
    db.query(
        "UPDATE data SET date = ?, document_number = ?, description = ? WHERE id = ?",
        [updateDataReq.date, updateDataReq.documentNumber, updateDataReq.description, updateDataReq.id],
        (err) => {
            if (err) callback(err)
            else {
                callback(null, baseResp(200, "Berhasil Mengedit Data"))
            }
            db.end()
        }
    )
}

export const remove = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const deleteDataReq: DeleteDataReq = {
        id: req.params.id
    }
    db.query(
        "SELECT * FROM data WHERE id = ?",
        [deleteDataReq.id],
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                const db2: Connection = mysql.createConnection(dbConfig)
                db2.query(
                    "DELETE FROM data WHERE id = ?",
                    [deleteDataReq.id],
                    (err) => {
                        if (err) callback(err)
                        else {
                            const filePath = path.join((process.env.SERVER === "production" ? "./dist" : ".") + "/src/uploads/", row[0].file)
                            try {
                                fs.unlinkSync(filePath)
                            } catch { }
                            callback(null, baseResp(200, "Berhasil Menghapus Data"))
                        }
                        db2.end()
                    }
                )
            }
            db.end()
        }
    )
}