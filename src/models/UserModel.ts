import jwt from 'jsonwebtoken'
import mysql, { RowDataPacket } from 'mysql2'
import { dbConfig } from '../../db'
import { GetUsersResp } from '../../src/types/user/GetUsersResp'
import { User } from '../../src/types/user/User'
import { PublicConstant } from '../PublicConstant'
import { BaseResp } from '../types/BaseResp'
import { JWTRequest } from '../types/JWTRequest'
import { LoginReq } from '../types/user/LoginReq'
import { LoginResp } from '../types/user/LoginResp'

export const login = (req: JWTRequest, callback: Function) => {
    const loginReq: LoginReq = req.body
    const db = mysql.createConnection(dbConfig)
    db.query(
        'SELECT * FROM user WHERE username = ? AND password = ?',
        [loginReq.username, loginReq.password],
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket> result)[0]
                if (!row) callback(null, {
                        errorSchema: {
                            errorCode: 401,
                            errorMessage: 'Incorrect Username or Password '
                        }
                    } as BaseResp)
                else {
                    const user: User = {
                        name: row.name,
                        role: row.role,
                        username: row.username
                    }
                    callback(null, {
                        errorSchema: {
                            errorCode: 200,
                            errorMessage: 'Login Success'
                        },
                        outputSchema: {
                            name: user.name,
                            role: user.role,
                            username: user.username,
                            token: jwt.sign(user, (process.env.SECRET_KEY ?? PublicConstant.SECRET_KEY) as string, { expiresIn: '1h' })
                        }
                    } as LoginResp)
                }
            }
            db.end()
        }
    )
}

export const getAll = (req: JWTRequest, callback: Function) => {
    const db = mysql.createConnection(dbConfig)
    db.query(
        'SELECT * FROM user',
        null,
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]> result)
                const users: User[] = row.map((user) => {
                    return {
                        name: user.name,
                        role: user.role,
                        username: user.username
                    }
                })
                callback(null, {
                    errorSchema: {
                        errorCode: 200,
                        errorMessage: 'Get All User Success'
                    },
                    outputSchema: users
                } as GetUsersResp)
            }
            db.end()
        }
    )
}