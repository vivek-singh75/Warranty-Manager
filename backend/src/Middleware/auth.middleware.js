const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")

async function authMiddleware(req , res,  next) {
    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(404).json({
                message : "token not availble"
            });
        }

        const decoded = jwt.verify(token ,  process.env.JWT_KEY);

        req.user = decoded;

        next()

    } catch (error) {
        console.log(`error in middleware ${error}`)

        res.status(500).json({
            message : `error in middleware ${error.message}`
        })
    }
}

module.exports = {
    authMiddleware,
}