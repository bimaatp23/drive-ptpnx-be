import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import express from 'express'
import { userRouter } from './routes/userRouter'

const app = express()
dotenv.config()

app.use(bodyParser.json())
app.use('/users', userRouter)

app.listen(process.env.PORT, () => {
    console.log('Node server started running')
})