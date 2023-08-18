import * as dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()

export const db = mysql.createConnection({
    host: 'localhost' ?? process.env.DB_HOST,
    user: 'root' ?? process.env.DB_USER,
    password: '' ?? process.env.DB_PWD,
    database: 'akuntansi' ?? process.env.DB_NAME
})