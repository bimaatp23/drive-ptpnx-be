import * as dotenv from 'dotenv'
import { PublicConstant } from './src/PublicConstant'

dotenv.config()

export const dbConfig = {
    host: process.env.DB_HOST ?? PublicConstant.DB_HOST,
    user: process.env.DB_USER ?? PublicConstant.DB_USER,
    password: process.env.DB_PWD ?? PublicConstant.DB_PWD,
    database: process.env.DB_NAME ?? PublicConstant.DB_NAME
}