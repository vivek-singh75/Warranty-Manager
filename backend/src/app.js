const express = require("express");
const cookieParser = require("cookie-parser")
const app = express();
const cors = require("cors")


const authRouter = require("./Routes/auth.route")


const allowedOrigins = [
    "http://localhost:5173",
    "https://vivek-singh75.github.io"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));


app.use(cookieParser())
app.use(express.json());
app.use(express.text());



app.use("/api/auth" , authRouter)




module.exports = app