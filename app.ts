import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import express from 'express'
import { userRouter } from './src/routes/UserRouter'

const app = express()
dotenv.config()

app.use(bodyParser.json())
app.use('/user', userRouter)

app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT)
})