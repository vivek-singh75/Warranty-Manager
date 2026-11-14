const {
    Client,
    StreamableHTTPClientTransport
} = require("@modelcontextprotocol/client");
 
const client = new Client({
        name : "warranty-manager-backend",
        version: "1.0.0"
    },{
        versionNegotiation: {
            mode: "auto"
        }
    }
);
 
const transport = new StreamableHTTPClientTransport(
    new URL("http://localhost:3001/mcp")
);
 
 
async function connectMCPServer() {
    try {
        await client.connect(transport)

        console.log("mcp client is connected with mcp server")

        const tools = await client.listTools();

        const toolsName = tools.tools.map(tool => tool.name)

        console.log("Available MCP Tools:");
        console.log(toolsName);
 
    } catch (error) {
        console.error("MCP connection failed:");
        console.error(error);
    }
}

// connectMCPServer()

module.exports = {
    client,
    connectMCPServer
};