const { McpServer } = require("@modelcontextprotocol/server");
const {
    NodeStreamableHTTPServerTransport
} = require("@modelcontextprotocol/node");
const {registerGetExpiringWarranties} = require("./src/tools")

const express = require("express");

const app = express();

app.use(express.json());

app.post("/mcp", async (req, res) => {
    try {
        const server = new McpServer({
            name: "warranty-manager-mcp",
            version: "1.0.0"
        });


        registerGetExpiringWarranties(server)

        const transport = new NodeStreamableHTTPServerTransport({
            sessionIdGenerator: undefined
        });

        await server.connect(transport);

        await transport.handleRequest(req, res, req.body);

    } catch (error) {
        console.error("MCP request failed:", error);

        if (!res.headersSent) {
            res.status(500).json({
                error: error.message
            });
        }
    }
});

app.listen(3001, () => {
    console.log("MCP server is running on port 3001");
});