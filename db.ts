import * as dotenv from 'dotenv'
import mysql from 'mysql2'

dotenv.config()
const variable = require('./public/variable.json')

export const db = mysql.createConnection({
    host: (process.env.DB_HOST ?? variable.DB_HOST),
    user: (process.env.DB_USER ?? variable.DB_USER),
    password: (process.env.DB_PWD ?? variable.DB_PWD),
    database: (process.env.DB_NAME ?? variable.DB_NAME)
})