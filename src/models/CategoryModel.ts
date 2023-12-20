import mysql, { Connection, RowDataPacket } from "mysql2"
import { dbConfig } from "../../db"
import { JWTRequest } from "../types/JWTRequest"
import { Category } from "../types/category/Category"
import { GetCatgeorysResp } from "../types/category/GetCategorysResp"
import { baseResp } from "../utils/Response"

export const getCategorys = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    db.query(
        "SELECT * FROM category ORDER BY name ASC",
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                let categorys: Category[] = row.map((data) => {
                    return {
                        id: data.id,
                        name: data.name
                    }
                })
                callback(null, baseResp(200, "Get Category List Success", categorys) as GetCatgeorysResp)
            }
            db.end()
        }
    )
}