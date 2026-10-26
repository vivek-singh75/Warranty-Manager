const express = require("express");
const cookieParser = require("cookie-parser")
const app = express();


const authRouter = require("./Routes/auth.route")

app.use(cookieParser())
app.use(express.json());
app.use(express.text());



app.use("/api/auth" , authRouter)




module.exports = app