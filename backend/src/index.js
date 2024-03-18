import dotenv from "dotenv"
import connectDB from "./utils/db.js";
import http from "http"
import { app } from './app.js'
import socketHandler from "./socket.js"

dotenv.config({
    path: './.env'
})

let server = http.createServer(app)

socketHandler(server)

connectDB()
.then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`⚙️ Socket and Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})