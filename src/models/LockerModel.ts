import mysql, { Connection, RowDataPacket } from "mysql2"
import { dbConfig } from "../../db"
import { JWTRequest } from "../types/JWTRequest"
import { CreateLockerReq } from "../types/locker/CreateLockerReq"
import { GetLockersResp } from "../types/locker/GetLockersResp"
import { Locker } from "../types/locker/Locker"
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
                        "INSERT INTO `locker` VALUES (?, ?, ?)",
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