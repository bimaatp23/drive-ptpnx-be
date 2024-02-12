import mysql, { Connection, RowDataPacket } from "mysql2"
import { dbConfig } from "../../db"
import { JWTRequest } from "../types/JWTRequest"
import { CreateEmployeeReq } from "../types/employee/CreateEmployeeReq"
import { DeleteEmployeeReq } from "../types/employee/DeleteEmployeeReq"
import { Employee } from "../types/employee/Employee"
import { GetEmployeesResp } from "../types/employee/GetEmployeesResp"
import { UpdateEmployeeReq } from "../types/employee/UpdateEmployeeReq"
import { baseResp, conflictResp } from "../utils/Response"
import { generateUUID } from "../utils/UUID"

export const getEmployees = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    db.query("SELECT * FROM employee",
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                let employees: Employee[] = row.map((data) => {
                    return {
                        id: data.id,
                        name: data.name,
                        contact: data.contact
                    }
                })
                callback(null, baseResp(200, "Berhasil Mendapatkan List Karyawan", employees) as GetEmployeesResp)
            }
            db.end()
        }
    )
}

export const create = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const createEmployeeReq: CreateEmployeeReq = req.body
    const uuid = generateUUID()
    db.query(
        "INSERT INTO employee VALUES (?, ?, ?)",
        [uuid, createEmployeeReq.name, createEmployeeReq.contact],
        (err, result) => {
            if (err) callback(err)
            else {
                callback(null, baseResp(200, "Berhasil Menambah Karyawan"))
            }
            db.end()
        }
    )
}

export const update = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const updateEmployeeReq: UpdateEmployeeReq = {
        ...req.body,
        id: req.params.id
    }
    db.query(
        "SELECT * FROM loan WHERE employee_id = ?",
        [updateEmployeeReq.id],
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                if (row.length > 0) {
                    callback(null, conflictResp("Karyawan Sedang Meminjam Dokumen"))
                } else {
                    const db2: Connection = mysql.createConnection(dbConfig)
                    db2.query(
                        "SELECT * FROM employee WHERE name = ? AND id != ?",
                        [updateEmployeeReq.name, updateEmployeeReq.id],
                        (err, result) => {
                            if (err) callback(err)
                            else {
                                const row = (<RowDataPacket[]>result)
                                if (row.length > 0) {
                                    callback(null, conflictResp("Nama Karyawan Sudah Digunakan"))
                                } else {
                                    const db3: Connection = mysql.createConnection(dbConfig)
                                    db3.query(
                                        "UPDATE employee SET name = ?, contact = ? WHERE id = ?",
                                        [updateEmployeeReq.name, updateEmployeeReq.contact, updateEmployeeReq.id],
                                        (err) => {
                                            if (err) callback(err)
                                            else {
                                                callback(null, baseResp(200, "Berhasil Mengedit Karyawan"))
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
    const deleteDataReq: DeleteEmployeeReq = {
        id: req.params.id
    }
    db.query(
        "SELECT * FROM loan WHERE employee_id = ?",
        [deleteDataReq.id],
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                if (row.length > 0) {
                    callback(null, conflictResp("Karyawan Sedang Meminjam Dokumen"))
                } else {
                    const db2: Connection = mysql.createConnection(dbConfig)
                    const deleteEmployeeReq: DeleteEmployeeReq = {
                        id: req.params.id
                    }
                    db2.query(
                        "DELETE FROM employee WHERE id = ?",
                        [deleteEmployeeReq.id],
                        (err) => {
                            if (err) callback(err)
                            else {
                                callback(null, baseResp(200, "Berhasil Menghapus Karyawan"))
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