import mysql, { Connection, RowDataPacket } from "mysql2"
import { dbConfig } from "../../db"
import { JWTRequest } from "../types/JWTRequest"
import { CreateCategoryReq } from "../types/category/CreateCategoryReq"
import { DeleteCategoryReq } from "../types/category/DeleteCategoryReq"
import { GetCategory, GetCategorysResp } from "../types/category/GetCategorysResp"
import { UpdateCategoryReq } from "../types/category/UpdateCategoryReq"
import { baseResp, conflictResp } from "../utils/Response"
import { generateUUID } from "../utils/UUID"

export const getCategorys = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    db.query(
        `SELECT
            c.id AS category_id,
            c.name AS category_name,
            COUNT(d.id) AS usage_count
        FROM
            category c
            LEFT JOIN
            data d ON c.id = d.category_id
        GROUP BY
            c.id, c.name
        ORDER BY
            category_name ASC`,
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                let categorys: GetCategory[] = row.map((data) => {
                    return {
                        id: data.category_id,
                        name: data.category_name,
                        usageCount: data.usage_count
                    }
                })
                callback(null, baseResp(200, "Berhasil Mendapatkan List Kategori", categorys) as GetCategorysResp)
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
                    callback(null, conflictResp("Nama Kategori Sudah Digunakan"))
                } else {
                    const db2: Connection = mysql.createConnection(dbConfig)
                    db2.query(
                        "INSERT INTO category VALUES (?, ?)",
                        [uuid, createCategoryReq.name],
                        (err, result) => {
                            if (err) callback(err)
                            else {
                                callback(null, baseResp(200, "Berhasil Menambah Kategori"))
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
    const updateCategoryReq: UpdateCategoryReq = {
        ...req.body,
        id: req.params.id
    }
    db.query(
        "SELECT * FROM data WHERE category_id = ?",
        [updateCategoryReq.id],
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                if (row.length > 0) {
                    callback(null, conflictResp("Kategori Sedang Digunakan"))
                } else {
                    const db2: Connection = mysql.createConnection(dbConfig)
                    db2.query(
                        "SELECT * FROM category WHERE name = ? AND id != ?",
                        [updateCategoryReq.name, updateCategoryReq.id],
                        (err, result) => {
                            if (err) callback(err)
                            else {
                                const row = (<RowDataPacket[]>result)
                                if (row.length > 0) {
                                    callback(null, conflictResp("Nama Kategori Sudah Digunakan"))
                                } else {
                                    const db3: Connection = mysql.createConnection(dbConfig)
                                    db3.query(
                                        "UPDATE category SET name = ? WHERE id = ?",
                                        [updateCategoryReq.name, updateCategoryReq.id],
                                        (err) => {
                                            if (err) callback(err)
                                            else {
                                                callback(null, baseResp(200, "Berhasil Mengedit Kategori"))
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
    const deleteCategoryReq: DeleteCategoryReq = {
        id: req.params.id
    }
    db.query(
        "SELECT * FROM data WHERE category_id = ?",
        [deleteCategoryReq.id],
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                if (row.length > 0) {
                    callback(null, conflictResp("Kategori Sedang Digunakan"))
                } else {
                    const db2: Connection = mysql.createConnection(dbConfig)
                    db2.query(
                        "DELETE FROM category WHERE id = ?",
                        [deleteCategoryReq.id],
                        (err) => {
                            if (err) callback(err)
                            else {
                                callback(null, baseResp(200, "Berhasil Menghapus Kategori"))
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