const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8" , "8.8.4.4"])

async function connectDB() {
    try {
        mongoose.connect(process.env.MONGO_URI);

        console.log("Databse Connected")
    } catch (error) {
        console.log(`error while connecting to the Database ${error.message}`)
    }
}

module.exports = connectDB