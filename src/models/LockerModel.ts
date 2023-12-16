import mysql, { Connection, RowDataPacket } from "mysql2"
import { dbConfig } from "../../db"
import { JWTRequest } from "../types/JWTRequest"
import { CreateLockerReq } from "../types/locker/CreateLockerReq"
import { DeleteLockerReq } from "../types/locker/DeleteLockerReq"
import { GetLockersResp } from "../types/locker/GetLockersResp"
import { Locker } from "../types/locker/Locker"
import { UpdateLockerReq } from "../types/locker/UpdateLockerReq"
import { baseResp, conflictResp } from "../utils/Response"
import { generateUUID } from "../utils/UUID"

export const getLocker = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    db.query(
        "SELECT * FROM locker ORDER BY name ASC",
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                let lockers: Locker[] = row.map((data) => {
                    return {
                        id: data.id,
                        name: data.name,
                        capacity: data.capacity
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
    const updateLockerReq: UpdateLockerReq = req.body
    db.query(
        "SELECT * FROM locker WHERE name = ? AND id != ?",
        [updateLockerReq.name, updateLockerReq.id],
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                if (row.length > 0) {
                    callback(null, conflictResp("Locker Name Already Exists"))
                } else {
                    const db2: Connection = mysql.createConnection(dbConfig)
                    db2.query(
                        "UPDATE locker SET name = ?, capacity = ?  WHERE id = ?",
                        [updateLockerReq.name, updateLockerReq.capacity, updateLockerReq.id],
                        (err, result) => {
                            if (err) callback(err)
                            else {
                                callback(null, baseResp(200, "Update Locker Success"))
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
    const deleteLockerReq: DeleteLockerReq = req.body
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
                        (err, result) => {
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