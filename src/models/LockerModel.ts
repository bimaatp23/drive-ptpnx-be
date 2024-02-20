import mysql, { Connection, RowDataPacket } from "mysql2"
import { dbConfig } from "../../db"
import { JWTRequest } from "../types/JWTRequest"
import { CreateLockerReq } from "../types/locker/CreateLockerReq"
import { DeleteLockerReq } from "../types/locker/DeleteLockerReq"
import { GetLocker, GetLockersResp } from "../types/locker/GetLockersResp"
import { UpdateLockerReq } from "../types/locker/UpdateLockerReq"
import { baseResp } from "../utils/Response"
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
        [],
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
                callback(null, baseResp(200, "Berhasil Mendapatkan List Loker", lockers) as GetLockersResp)
            }
            db.end()
        }
    )
}

export const create = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const createLockerReq: CreateLockerReq = req.body
    const uuid = req.body.uuid ?? generateUUID()
    db.query(
        "INSERT INTO locker VALUES (?, ?, ?)",
        [uuid, createLockerReq.name, createLockerReq.capacity],
        (err, result) => {
            if (err) callback(err)
            else {
                callback(null, baseResp(200, "Berhasil Menambah Loker"))
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
        "UPDATE locker SET name = ?, capacity = ? WHERE id = ?",
        [updateLockerReq.name, updateLockerReq.capacity, updateLockerReq.id],
        (err) => {
            if (err) callback(err)
            else {
                callback(null, baseResp(200, "Berhasil Mengedit Loker"))
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
        "DELETE FROM locker WHERE id = ?",
        [deleteLockerReq.id],
        (err) => {
            if (err) callback(err)
            else {
                callback(null, baseResp(200, "Berhasil Menghapus Loker"))
            }
            db.end()
        }
    )
}