require("dotenv").config()
const app = require("./src/app");
// const {connectMCPServer} =  require("./src/MCP-Client/mcpClient")

const connectDB = require("./src/DB/db");

 
const PORT = process.env.PORT || 3000

async function startServer() {
    try {
        await connectDB();
        // await connectMCPServer();

        app.listen(PORT , ()=>{
            console.log(`server is running on port ${PORT}`)
        });

    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
}

startServer()

