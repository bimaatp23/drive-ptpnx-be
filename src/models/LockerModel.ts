import mysql, { Connection, RowDataPacket } from "mysql2"
import { dbConfig } from "../../db"
import { JWTRequest } from "../types/JWTRequest"
import { GetLockersResp } from "../types/locker/GetLockersResp"
import { Locker } from "../types/locker/Locker"
import { baseResp } from "../utils/Response"

export const getLocker = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    db.query(
        "SELECT * FROM locker",
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