import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import express from 'express'
import { DataRouter } from './src/routes/DataRouter'
import { UserRouter } from './src/routes/UserRouter'

const app = express()
const cors = require('cors')
dotenv.config()

const endPoint: string = '/drive/api'

app.use(cors())

app.use(bodyParser.json())
app.use(endPoint + '/user', UserRouter)
app.use(endPoint + '/data', DataRouter)

app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT + ' ' + process.env.SERVER)
})