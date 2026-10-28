const productModel = require("../Schema/productModel");
const productDetailsFromAI = require("../Services/ai.service");
const userModel = require("../Schema/userModel");


const history= [];       

async function addProduct(req , res) {

    try {
        const {userQuery} = req.body;

        const userId = req.user.id;

        if(!userId){
            return res.status(500).json({message : "userId is not Defined"})
        }

        if(!userQuery){
            return res.status(500).json({message : "userQuery is not Defined"})
        }

        history.push({
            type : "text",
            text : `${userQuery} role user`
        })   

        const response = await productDetailsFromAI(history)

        const output = JSON.parse(response.output_text)

        if(output.status === "missing"){

            history.push({
                type : "text",
                text : `${response.missing} , ${response.question} role LLM`
            });

            return res.status(409).json({
                message: output.question
            })
        }  

        const startDate = new Date(output.product.warranty.startDate);

        const expiryDate = new Date(startDate);
            expiryDate.setMonth(
                expiryDate.getMonth() + output.product.warranty.durationMonths
            );

        const productDetails = await productModel.create({
            userId : userId,
            productName: output.product.productName,
            brand : output.product.brand,
            category : output.product.category,
            purchaseDate : output.product.purchaseDate,
            purchasePrice : output.product.purchasePrice,
            warranty:[{
                durationMonths: output.product.warranty.durationMonths,
                startDate: output.product.warranty.startDate,
                expiryDate : expiryDate,
                type: output.product.warranty.type,
            }]
        })

        res.status(200).json({
            message : "Product Data Saved",
            productDetails
        });


    } catch (error) {
        console.log(error.message)

        return res.status(500).json({
            message : `${error.message}`
        })
    }   
    
}



module.exports = {
    addProduct,
}