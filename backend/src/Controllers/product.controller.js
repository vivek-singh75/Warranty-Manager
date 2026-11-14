const productModel = require("../Schema/productModel");
const productDetailsFromAI = require("../Services/ai.service");
const userModel = require("../Schema/userModel");



const userHistories = new Map();

async function addProduct(req, res) {
    const userId = req.user?.id || req.user?._id;
    const { userQuery } = req.body;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "User is not authenticated"
        });
    }

    if (!userQuery || typeof userQuery !== "string" || !userQuery.trim()) {
        return res.status(400).json({
            success: false,
            message: "userQuery is required"
        });
    }

    const id = userId.toString();

    // Get or create user-specific history
    if (!userHistories.has(id)) {
        userHistories.set(id, []);
    }

    const history = userHistories.get(id);

    // Store current user's message
    history.push({
        type: "text",
        text: `${userQuery.trim()} role user`
    });

    try {
        const response = await productDetailsFromAI(history);

        const aiResponse = response.output_text;

        if (!aiResponse) {
            throw new Error("AI returned an empty response");
        }

        let output;

        try {
            // Remove markdown code fences if present
            const cleanedResponse = aiResponse
                .replace(/```json/gi, "")
                .replace(/```/g, "")
                .trim();

            output = JSON.parse(cleanedResponse);
        } catch (error) {
           
            history.push({
                type: "text",
                text: `${aiResponse} role LLM`
            });

            return res.status(200).json({
                success: false,
                status: "missing",
                message: aiResponse
            });
        }

        // Required information is missing
        if (output.status === "missing") {
            const question =
                output.question || "Please provide the missing information.";

            history.push({
                type: "text",
                text: `${question} role LLM`
            });

            return res.status(200).json({
                success: false,
                status: "missing",
                message: question,
                missing: output.missing || []
            });
        }

        // Validate AI response
        if (
            output.status !== "complete" ||
            !output.product ||
            !output.product.productName ||
            !output.product.purchaseDate ||
            !output.product.warranty
        ) {
            throw new Error("Invalid product details returned by AI");
        }

        const product = output.product;
        const warranty = product.warranty;

        const durationMonths = Number(warranty.durationMonths);
        const startDate = new Date(warranty.startDate);
        const purchaseDate = new Date(product.purchaseDate);

        if (
            !Number.isFinite(durationMonths) ||
            durationMonths < 1 ||
            !Number.isFinite(startDate.getTime()) ||
            !Number.isFinite(purchaseDate.getTime())
        ) {
            throw new Error("Invalid date or warranty duration");
        }

        // Calculate expiry date on server
        const expiryDate = new Date(startDate);
        expiryDate.setMonth(
            expiryDate.getMonth() + durationMonths
        );

        const productDetails = {
            productName: product.productName,
            brand: product.brand || "",
            category: product.category || "",
            purchaseDate,
            purchasePrice: product.purchasePrice ?? null,

            warranty: [
                {
                    durationMonths,
                    startDate,
                    expiryDate,
                    type: warranty.type || "Manufacturer",
                    placeOfWarrantyCard:
                        warranty.placeOfWarrantyCard || ""
                }
            ],

            serialNumber: product.serialNumber || "",
            seller: product.seller || "",
            notes: product.notes || ""
        };

        // Product information is complete.
        // Clear only this user's conversation history.
        userHistories.delete(id);

        return res.status(200).json({
            success: true,
            message: "Check Product details and Submit",
            productDetails
        });

    } catch (error) {
        console.error("Add Product Error:", error);

        // Remove the failed user message so it isn't
        // accidentally repeated in the next AI request.
        history.pop();

        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
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
                placeOfWarrantyCard: output.warranty[0].placeOfWarrantyCard

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