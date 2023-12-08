import * as BodyParser from "body-parser"
import cors from "cors"
import * as dotenv from "dotenv"
import express from "express"
import * as fs from "fs"
import path from "path"
import { DataRouter } from "./src/routes/DataRouter"
import { UserRouter } from "./src/routes/UserRouter"

const app = express()
dotenv.config()

app.use(cors())

let filePathTemp = path.join((process.env.SERVER === "production" ? "./dist" : ".") + "/src/uploads/temp/")
if (!fs.existsSync(filePathTemp)) {
    fs.mkdirSync(filePathTemp, { recursive: true })
}

app.use(BodyParser.json())
app.use("/user", UserRouter)
app.use("/data", DataRouter)

app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT + " " + process.env.SERVER)
})