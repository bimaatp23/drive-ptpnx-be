import { RowDataPacket } from 'mysql2'
import { db } from '../db'
import { Users } from '../types/users'

export const get = (callback: Function) => {
    const queryString = 'SELECT * FROM users'
    db.query(
        queryString,
        null,
        (err, result) => {
            if (err) {callback(err)}
            const row = (<RowDataPacket> result)[0]
            const user: Users = {
                id: row.id,
                name: row.name,
                role: row.role,
                username: row.username,
                password: row.password,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            } 
            callback(null, user)
        }
    )
}