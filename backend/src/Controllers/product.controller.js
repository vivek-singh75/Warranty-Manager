const productModel = require("../Schema/productModel");
const productDetailsFromAI = require("../Services/ai.service");
const userModel = require("../Schema/userModel");


const history= [];       

async function addProduct(req , res) {

    try {
        const {userQuery} = req.body;
        console.log(userQuery)

        const userId = req.user.id;

        if(!userId){ 
            return res.status(404).json({
                success: false,
                message : "userId is not Defined"
            })
        }
 
        if(!userQuery){
            return res.status(501).json({
                 success: false,
                message : "userQuery is not Defined"
            })
        }

        history.push({
            type : "text",
            text : `${userQuery} role user`
        })   

        const response = await productDetailsFromAI(history)

        const output = JSON.parse(response.output_text)
        console.log(output)

        if(output.status === "missing"){

            history.push({
                type : "text",
                text : `${response.missing} , ${response.question} role LLM`
            });

            console.log(output.question)

            return res.status(209).json({
                success: false,
                status: output.status,
                message: output.question
            })
        }  

        const startDate = new Date(output.product.warranty.startDate);

        const expiryDate = new Date(startDate);
            expiryDate.setMonth(
                expiryDate.getMonth() + output.product.warranty.durationMonths
            );

        const productDetails ={
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
        }

        // const productDetailss = await productModel.create({
        //     userId : userId,
        //     productName: output.product.productName,
        //     brand : output.product.brand,
        //     category : output.product.category,
        //     purchaseDate : output.product.purchaseDate,
        //     purchasePrice : output.product.purchasePrice,
        //     warranty:[{
        //         durationMonths: output.product.warranty.durationMonths,
        //         startDate: output.product.warranty.startDate,
        //         expiryDate : expiryDate,
        //         type: output.product.warranty.type,
        //     }]
        // })

        res.status(200).json({
            success: true,
            message : "Check Product details and Submit",
            productDetails
        });


    } catch (error) {
        console.log(error.message)

        return res.status(503).json({
            success: false,
            message : `${error.message}`
        })
    }   
    
}


async function submitProducts(req ,res) {
    try {
        const Details = req.body;

        const userId = req.user.id;


        if(!userId){
            return res.status(404).json({
                success : false,
                message : "userId not found "
            })
        }

        if(!Details){
            return res.status(404).json({
                success : false,
                message : "products details not found "
            })
        }

        const output = Details
        console.log(output)

        const productDetails = await productModel.create({
            userId : userId,
            productName: output.productName,
            brand : output.brand,
            category : output.category,
            purchaseDate : output.purchaseDate,
            purchasePrice : output.purchasePrice,
            warranty:[{
                durationMonths: output.warranty[0].durationMonths,
                startDate: output.warranty[0].startDate,
                expiryDate : output.warranty[0].expiryDate,
                type: output.warranty[0].type,
            }]
        })

        if(!productDetails){
            return res.status(400).json({
                success : false,
                message : "products details not saved "
            })
        }

        res.status(200).json({
            success: true ,
            message : "Data Saved ",
            productDetails
        })

    } catch (error) {
        console.log(error.message)

        return res.status(503).json({
            success: false,
            message : `${error.message}`
        })
    }
}



module.exports = {
    addProduct,
    submitProducts,
}