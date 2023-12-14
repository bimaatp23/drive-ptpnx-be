import jwt from "jsonwebtoken"
import mysql, { Connection, RowDataPacket } from "mysql2"
import { dbConfig } from "../../db"
import { GetUsersResp } from "../../src/types/user/GetUsersResp"
import { User } from "../../src/types/user/User"
import { JWTRequest } from "../types/JWTRequest"
import { ChangePasswordReq } from "../types/user/ChangePasswordReq"
import { LoginReq } from "../types/user/LoginReq"
import { LoginResp } from "../types/user/LoginResp"
import { badRequestResp, baseResp, unauthorizedResp } from "../utils/Response"

export const login = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    const loginReq: LoginReq = req.body
    db.query(
        "SELECT * FROM user WHERE username = ? AND password = ?",
        [loginReq.username, loginReq.password],
        (err, result) => {
            if (err) {
                callback(err)
            } else {
                const row = (<RowDataPacket>result)[0]
                if (!row) {
                    callback(null, unauthorizedResp("Incorrect Username or Password"))
                } else {
                    const user: User = {
                        name: row.name,
                        role: row.role,
                        username: row.username
                    }
                    callback(null, baseResp(200, "Login Success", {
                        name: user.name,
                        role: user.role,
                        username: user.username,
                        token: jwt.sign(user, process.env.SECRET_KEY as string)
                    }) as LoginResp)
                }
            }
            db.end()
        }
    )
}

export const changePassword = (req: JWTRequest, callback: Function) => {
    const changePasswordReq: ChangePasswordReq = req.body
    if (changePasswordReq.newPassword !== changePasswordReq.confirmPassword) {
        callback(null, badRequestResp("New Passwords Do Not Match"))
    } else {
        const db: Connection = mysql.createConnection(dbConfig)
        db.query(
            "SELECT * FROM user WHERE username = ? AND password = ?",
            [req.payload?.username, changePasswordReq.oldPassword],
            (err, result) => {
                if (err) {
                    callback(err)
                } else {
                    const row = (<RowDataPacket>result)[0]
                    if (!row) {
                        callback(null, unauthorizedResp("Old Password Is Wrong"))
                    } else {
                        const db2: Connection = mysql.createConnection(dbConfig)
                        db2.query(
                            "UPDATE user SET password = ? WHERE username = ?",
                            [changePasswordReq.newPassword, req.payload?.username],
                            (err, result) => {
                                if (err) {
                                    callback(err)
                                } else {
                                    callback(null, baseResp(200, "Change Password Success"))
                                }
                            }
                        )
                    }
                }
                db.end()
            }
        )
    }
}

export const getAll = (req: JWTRequest, callback: Function) => {
    const db: Connection = mysql.createConnection(dbConfig)
    db.query(
        "SELECT * FROM user",
        null,
        (err, result) => {
            if (err) {
                callback(err)
            }
            else {
                const row = (<RowDataPacket[]>result)
                const users: User[] = row.map((user) => {
                    return {
                        name: user.name,
                        role: user.role,
                        username: user.username
                    }
                })
                callback(null, baseResp(200, "Get All User Success", users) as GetUsersResp)
            }
            db.end()
        }
    )
}