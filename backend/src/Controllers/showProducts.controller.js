const {client} = require("../MCP-Client/mcpClient")
const productModel = require("../Schema/productModel");
const queryToTool = require("../Services/ai.queryToTool")



const history = []

async function listproductsByQuery(req, res) {
    try {
        const { userQuery } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        if (!userQuery) {
            return res.status(400).json({
                success: false,
                message: "userQuery is not provided"
            }); 
        }

        history.push({
            type: "text",
            text: `${userQuery} role user`
        });

        // Gemini selects the appropriate MCP tool
        const aiResponse = await queryToTool(history);

        if (!aiResponse.success) {
            history.push({
                type: "text",
                text: `${aiResponse.question} role LLM`
            });

            return res.status(200).json({
                success: false,
                message: aiResponse.question
            });
        }

        const { toolName, arguments: toolArguments } = aiResponse;

        // Get available tools from MCP Server
        const availableTools = await client.listTools();

        const selectedTool = availableTools.tools.find(
            tool => tool.name === toolName
        );

        if (!selectedTool) {
            throw new Error(`MCP tool not found: ${toolName}`);
        }

        // Backend supplies authenticated userId
        const finalArguments = {
            ...toolArguments,
            userId: userId.toString()
        };
        if (aiResponse.toolName === "getProductByMonths") {
            if (
                !Number.isInteger(aiResponse.arguments.months) ||
                aiResponse.arguments.months < 1 ||
                aiResponse.arguments.months > 36
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid number of months (1-36)."
                });
            }
        }

        // Execute selected MCP tool
        const response = await client.callTool({
            name: toolName,
            arguments: finalArguments
        });

        if (response.isError) {
            throw new Error(response.content?.[0]?.text || "MCP tool execution failed");
        }

        const toolResult = JSON.parse(response.content[0].text);

       // console.log(toolResult)
        if (!toolResult.success) {
            throw new Error(toolResult.message || "Unable to fetch products");
        }

        history.push({
            type: "text",
            text: `MCP tool ${toolName} executed successfully. role LLM`
        });

        return res.status(200).json({
            success: true,
            toolName,
            message: toolResult.message || "Data fetched successfully",
            ...toolResult
        });

    } catch (error) {
        console.error("listproductsByQuery error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

 
async function top10Products(req , res) {

    try {
        const userId = req.user.id

        if(!userId){
            return res.status(500).json({
                success: false,
                message : "unauthorized access"
            });
        }

        const products = await productModel.find({
            userId,
            "warranty.expiryDate": {
                $gte: new Date()
            }
            }).select("-userId -__v -purchaseDate -purchasePrice -warranty.type -warranty._id")
            .sort({
                "warranty.expiryDate": 1
            })
            .limit(5);


        res.status(200).json({
            success : true,
            products
        })

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

}


async function fetchProductController(req , res) {
    try {
        const productId = req.params.id;

        if(!productId){
            return res.status(401).json({
                success : false,
                message : "product id is not provided"
            });
        }

        const productDetails = await productModel.findById(productId);

        if(!productDetails){
            return res.status(404).json({
                success : false,
                message : "Product detail not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "product fetched successfully",
            productDetails
        });
        
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



module.exports={
    listproductsByQuery,
    top10Products,
    fetchProductController,
}

 
async function getExpiringProducts(userId, days) {

    const today = new Date();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    const products = await productModel.find({
        userId,
        "warranty.expiryDate": {
            $gte: today,
            $lte: cutoffDate
        }
    })
    .sort({ "warranty.expiryDate": 1 })
    .limit(10);

    return products;
}
