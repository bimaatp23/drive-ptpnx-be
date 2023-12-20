import mysql, { Connection, RowDataPacket } from "mysql2"
import { dbConfig } from "../../db"
import { JWTRequest } from "../types/JWTRequest"
import { Category } from "../types/category/Category"
import { CreateCategoryReq } from "../types/category/CreateCategoryReq"
import { GetCategorysResp } from "../types/category/GetCategorysResp"
import { UpdateCategoryReq } from "../types/category/UpdateCategoryReq"
import { baseResp, conflictResp } from "../utils/Response"
import { generateUUID } from "../utils/UUID"

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
                callback(null, baseResp(200, "Get Category List Success", categorys) as GetCategorysResp)
            }
            db.end()
        }
    )
}

export const create = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const createCategoryReq: CreateCategoryReq = req.body
    const uuid = generateUUID()
    db.query(
        "SELECT * FROM category WHERE name = ?",
        [createCategoryReq.name],
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                if (row.length > 0) {
                    callback(null, conflictResp("Category Name Already Exists"))
                } else {
                    const db2: Connection = mysql.createConnection(dbConfig)
                    db2.query(
                        "INSERT INTO category VALUES (?, ?)",
                        [uuid, createCategoryReq.name],
                        (err, result) => {
                            if (err) callback(err)
                            else {
                                callback(null, baseResp(200, "Create Category Success"))
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
    const updateCategoryReq: UpdateCategoryReq = req.body
    db.query(
        "SELECT * FROM category WHERE name = ? AND id != ?",
        [updateCategoryReq.name, updateCategoryReq.id],
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                if (row.length > 0) {
                    callback(null, conflictResp("Category Name Already Exists"))
                } else {
                    const db2: Connection = mysql.createConnection(dbConfig)
                    db2.query(
                        "UPDATE category SET name = ? WHERE id = ?",
                        [updateCategoryReq.name, updateCategoryReq.id],
                        (err, result) => {
                            if (err) callback(err)
                            else {
                                callback(null, baseResp(200, "Update Category Success"))
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