import mysql, { Connection, RowDataPacket } from "mysql2"
import { dbConfig } from "../../db"
import { JWTRequest } from "../types/JWTRequest"
import { CreateLockerReq } from "../types/locker/CreateLockerReq"
import { DeleteLockerReq } from "../types/locker/DeleteLockerReq"
import { GetLocker, GetLockersResp } from "../types/locker/GetLockersResp"
import { UpdateLockerReq } from "../types/locker/UpdateLockerReq"
import { baseResp, conflictResp } from "../utils/Response"
import { generateUUID } from "../utils/UUID"

export const getLockers = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
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
                callback(null, baseResp(200, "Get Locker List Success", lockers) as GetLockersResp)
            }
            db.end()
        }
    )
}

export const create = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const createLockerReq: CreateLockerReq = req.body
    const uuid = generateUUID()
    db.query(
        "SELECT * FROM locker WHERE name = ?",
        [createLockerReq.name],
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                if (row.length > 0) {
                    callback(null, conflictResp("Locker Name Already Exists"))
                } else {
                    const db2: Connection = mysql.createConnection(dbConfig)
                    db2.query(
                        "INSERT INTO locker VALUES (?, ?, ?)",
                        [uuid, createLockerReq.name, createLockerReq.capacity],
                        (err, result) => {
                            if (err) callback(err)
                            else {
                                callback(null, baseResp(200, "Create Locker Success"))
                            }
                            db2.end()
                        }
                    )
                }
            }
            db.end()
        }
    )
}

export const update = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const updateLockerReq: UpdateLockerReq = {
        ...req.body,
        id: req.params.id
    }
    db.query(
        "SELECT * FROM data WHERE locker_id = ?",
        [updateLockerReq.id],
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                if (row.length > 0) {
                    callback(null, conflictResp("Locker Already Used"))
                } else {
                    const db2: Connection = mysql.createConnection(dbConfig)
                    db2.query(
                        "SELECT * FROM locker WHERE name = ? AND id != ?",
                        [updateLockerReq.name, updateLockerReq.id],
                        (err, result) => {
                            if (err) callback(err)
                            else {
                                const row = (<RowDataPacket[]>result)
                                if (row.length > 0) {
                                    callback(null, conflictResp("Locker Name Already Exists"))
                                } else {
                                    const db3: Connection = mysql.createConnection(dbConfig)
                                    db3.query(
                                        "UPDATE locker SET name = ?, capacity = ? WHERE id = ?",
                                        [updateLockerReq.name, updateLockerReq.capacity, updateLockerReq.id],
                                        (err) => {
                                            if (err) callback(err)
                                            else {
                                                callback(null, baseResp(200, "Update Locker Success"))
                                            }
                                            db3.end()
                                        }
                                    )
                                }
                            }
                            db2.end()
                        }
                    )
                }
            }
            db.end()
        }
    )
}

export const remove = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const deleteLockerReq: DeleteLockerReq = {
        id: req.params.id
    }
    db.query(
        "SELECT * FROM data WHERE locker_id = ?",
        [deleteLockerReq.id],
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                if (row.length > 0) {
                    callback(null, conflictResp("Locker Already Used"))
                } else {
                    const db2: Connection = mysql.createConnection(dbConfig)
                    db2.query(
                        "DELETE FROM locker WHERE id = ?",
                        [deleteLockerReq.id],
                        (err) => {
                            if (err) callback(err)
                            else {
                                callback(null, baseResp(200, "Delete Locker Success"))
                            }
                            db2.end()
                        }
                    )
                }
            }
            db.end()
        }
    )
}