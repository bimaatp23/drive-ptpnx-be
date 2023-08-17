import { RowDataPacket } from 'mysql2'
import { db } from '../../db'
import { GetUsersResp } from '../../src/types/user/GetUsersResp'
import { User } from '../../src/types/user/User'

export const getAll = (callback: Function) => {
    const queryString = 'SELECT * FROM users'
    db.query(
        queryString,
        null,
        (err, result) => {
            if (err) {callback(err)}
            const row = (<RowDataPacket[]> result)
            const users: User[] = row.map((data) => {
                return {
                    name: data.name,
                    role: data.role,
                    username: data.username
                }
            })
            const resp: GetUsersResp = {
                errorSchema: {
                    errorCode: 200,
                    errorMessage: 'Get All User Success'
                },
                outputSchema: users
            } 
            callback(null, resp)
        }
    )
}