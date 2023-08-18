import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import express from 'express'
import { DataRouter } from './src/routes/DataRouter'
import { UserRouter } from './src/routes/UserRouter'

const app = express()
dotenv.config()

app.use(bodyParser.json())
app.use('/user', UserRouter)
app.use('/data', DataRouter)

app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT)
})