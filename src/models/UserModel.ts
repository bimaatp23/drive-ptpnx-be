import { RowDataPacket } from 'mysql2'
import { db } from '../../db'
import { GetUsersResp } from '../../src/types/user/GetUsersResp'
import { User } from '../../src/types/user/User'
import { LoginReq } from '../types/user/LoginReq'
import { BaseResp } from '../types/BaseResp'
import { LoginResp } from '../types/user/LoginResp'
import jwt from 'jsonwebtoken'

export const login = (req: LoginReq, callback: Function) => {
    db.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [req.username, req.password],
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
                            token: jwt.sign(user, 'NikenPuspitaLarasati27072001', { expiresIn: '1h' })
                        }
                    } as LoginResp)
                }
            }
        }
    )
}

export const getAll = (callback: Function) => {
    db.query(
        'SELECT * FROM users',
        null,
        (err, result) => {
            if (err) callback(err)
            else {
                const row = (<RowDataPacket[]> result)
                const users: User[] = row.map((data) => {
                    return {
                        name: data.name,
                        role: data.role,
                        username: data.username
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
        }
    )
}