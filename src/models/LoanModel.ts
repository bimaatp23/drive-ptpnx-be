import moment from "moment"
import mysql, { Connection, RowDataPacket } from "mysql2"
import { dbConfig } from "../../db"
import { JWTRequest } from "../types/JWTRequest"
import { CreateLoanReq } from "../types/loan/CreateLoanReq"
import { DeleteLoanReq } from "../types/loan/DeleteLoanReq"
import { GetLoansResp } from "../types/loan/GetLoansResp"
import { Loan } from "../types/loan/Loan"
import { UpdateLoanReq } from "../types/loan/UpdateLoanReq"
import { baseResp } from "../utils/Response"
import { generateUUID } from "../utils/UUID"

export const getLoans = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    db.query(
        "SELECT * FROM loan",
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]>result)
                let lockers: Loan[] = row.map((data) => {
                    return {
                        id: data.id,
                        dataId: data.data_id,
                        employeeId: data.employee_id,
                        loanDate: data.loan_date,
                        dueDate: data.due_date,
                        returnDate: data.return_date,
                        reminder: data.reminder
                    }
                })
                callback(null, baseResp(200, "Get Loan List Success", lockers) as GetLoansResp)
            }
            db.end()
        }
    )
}

export const create = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const createLoanReq: CreateLoanReq = req.body
    const uuid = generateUUID()
    const currentDate = moment()
    const loanDate: string = currentDate.format("YYYY-MM-DD HH:mm:ss")
    const dueDate: string = currentDate.add(1, "days").format("YYYY-MM-DD HH:mm:ss")
    db.query(
        "INSERT INTO loan VALUES (?, ?, ?, ?, ?, ?, ?)",
        [uuid, createLoanReq.dataId, createLoanReq.employeeId, loanDate, dueDate, null, 0],
        (err, result) => {
            if (err) callback(err)
            else {
                callback(null, baseResp(200, "Create Loan Success"))
            }
            db.end()
        }
    )
}

export const update = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const updateLoanReq: UpdateLoanReq = {
        ...req.body,
        id: req.params.id
    }
    const currentDate = moment()
    const returnDate: string = currentDate.format("YYYY-MM-DD HH:mm:ss")
    db.query(
        "UPDATE loan SET return_date = ?, id = ?",
        [returnDate, updateLoanReq.id],
        (err) => {
            if (err) callback(err)
            else {
                callback(null, baseResp(200, "Update Loan Success"))
            }
            db.end()
        }
    )
}

export const remove = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const deleteLoanReq: DeleteLoanReq = {
        id: req.params.id
    }
    db.query(
        "DELETE FROM loan WHERE id = ?",
        [deleteLoanReq.id],
        (err) => {
            if (err) callback(err)
            else {
                callback(null, baseResp(200, "Delete Loan Success"))
            }
            db.end()
        }
    )
}