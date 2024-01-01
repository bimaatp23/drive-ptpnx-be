import * as fs from "fs"
import mysql, { Connection, RowDataPacket } from "mysql2"
import path from "path"
import { dbConfig } from "../../db"
import { BaseResp } from "../types/BaseResp"
import { JWTRequest } from "../types/JWTRequest"
import { Data } from "../types/data/Data"
import { GetDatasReq } from "../types/data/GetDatasReq"
import { GetDatasResp } from "../types/data/GetDatasResp"
import { UpdateDataReq } from "../types/data/UpdateDataReq"
import { UploadDataReq } from "../types/data/UploadDataReq"
import { GetLocker } from "../types/locker/GetLockersResp"
import { badRequestResp, baseResp, conflictResp, errorResp, notFoundResp } from "../utils/Response"
import { generateUUID } from "../utils/UUID"

export const getDatas = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const db2: Connection = mysql.createConnection(dbConfig)
    const getDataReq: GetDatasReq = {
        categoryId: req.query.categoryId as string ?? "",
        lockerId: req.query.lockerId as string ?? "",
        dateFrom: req.query.dateFrom as string ?? "",
        dateUntil: req.query.dateUntil as string ?? "",
        documentNumber: req.query.documentNumber as string ?? "",
        description: req.query.description as string ?? ""
    }
    const payload = req.payload
    db2.query(
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
                callback(null, baseResp(200, "Get Data List Success", datas) as GetDatasResp)
            }
            db2.end()
        }
    )
}

export const upload = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const uploadDataReq: UploadDataReq = req.body
    const payload = req.payload
    const file = req.file
    const uuid = generateUUID()
    db.query(
        `SELECT
            l.id AS locker_id,
            l.name AS locker_name,
            l.capacity,
            COUNT(d.id) AS usage_count
        FROM
            locker l
        LEFT JOIN
            data d ON l.id = d.locker_id
        GROUP BY
            l.id, l.name, l.capacity
        ORDER BY
            locker_name ASC`,
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                let lockers: GetLocker[] = row.map((data) => {
                    return {
                        id: data.locker_id,
                        name: data.locker_name,
                        capacity: data.capacity,
                        usageCount: data.usage_count
                    }
                })
                lockers = lockers.filter((data) => data.id === uploadDataReq.lockerId)
                if (lockers[0].capacity - lockers[0].usageCount === 0) {
                    callback(null, conflictResp("Locker Capacity is Full"))
                } else {
                    const db2: Connection = mysql.createConnection(dbConfig)
                    if (file) {
                        db2.query(
                            "INSERT INTO `data` VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                            [uuid, uploadDataReq.date, uploadDataReq.documentNumber, uploadDataReq.description, uploadDataReq.categoryId, uploadDataReq.lockerId, uuid + path.extname(file.filename), payload?.username],
                            (err) => {
                                if (err) {
                                    callback(err, errorResp(err.message))
                                } else {
                                    const sourcePath = path.join((process.env.SERVER === "production" ? "./dist" : ".") + "/src/uploads/temp/", file.filename)
                                    const destinationPath = path.join((process.env.SERVER === "production" ? "./dist" : ".") + "/src/uploads/", uuid + path.extname(file.filename))
                                    fs.renameSync(sourcePath, destinationPath)
                                    callback(null, baseResp(200, "Upload Data Success"))
                                }
                                db2.end()
                            }
                        )
                    } else {
                        callback(null, badRequestResp())
                    }
                }
            }
            db.end()
        }
    )
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
                    callback(null, notFoundResp("File Not Found"))
                } else {
                    callback(null, baseResp(200, "Download Data Success", {
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
                callback(null, baseResp(200, "Update Locker Success"))
            }
            db.end()
        }
    )
}