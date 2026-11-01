const {client} = require("../MCP-Client/mcpClient")
const productModel = require("../Schema/productModel");
const queryToDays = require("../Services/ai.daysFind")



const history = []
async function listproductsByQuery(req , res) {
    const {userQuery} = req.body

    const userId = req.user.id;

    if(!userId){
        return res.status(500).json({
            success: false,
            message : "unauthorized access"
        });
    }

    if(!userQuery){
        return res.status(400).json({
            success: false,
            message : "userQuery is not provided"
        });
    }

    try {
        history.push({
            type : "text",
            text : `${userQuery} role user`
        })

        let aiResponse = await queryToDays(history);

        aiResponse = JSON.parse(aiResponse)
        console.log(aiResponse)

        if(!(aiResponse.success)){
            history.push({
                type : "text",
                text : `${userQuery} role LLM`
            })

            return res.status(209).json({
                success: false,
                message : aiResponse
            })
        }
        const days = aiResponse.days 

        console.log(`days is ${days}`)

        const response = await getExpiringProducts(userId , days)

        console.log(response);

        return res.status(200).json({
            success: true,
            message : `list of product which expire in ${days} days`,
            products : response
        });
 
    } catch (error) {
        
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

}


 
async function top10Products(req , res) {

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

    console.log(products)

    res.status(200).json({
        success : true,
        products
    })

}



module.exports={
    listproductsByQuery,
    top10Products,

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
