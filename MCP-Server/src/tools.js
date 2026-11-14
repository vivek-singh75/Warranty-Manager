const z = require("zod");
const productModel = require("../src/Schema/productModel");


function productsByDays(server) {
    server.registerTool(
        "getProductsByDays",
        {
            description:
                "Find products belonging to a user whose warranty will expire within the specified number of days.",

            inputSchema: {
                userId: z.string().min(1),
                days: z.number().int().min(1).max(365)
            }
        },

        async ({ userId, days }) => {
            try {
                const startDate = new Date();
                startDate.setHours(0, 0, 0, 0);

                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + days);
                endDate.setHours(23, 59, 59, 999);

                const products = await productModel.find({
                    userId,
                    warranty: {
                        $elemMatch: {
                            expiryDate: {
                                $gte: startDate,
                                $lte: endDate
                            }
                        }
                    }
                })
                .select(
                    "productName brand category purchaseDate purchasePrice warranty"
                )
                .lean();

                const result = products.map(product => ({
                    ...product,
                    warranty: product.warranty.filter(item => {
                        const expiryDate = new Date(item.expiryDate);

                        return (
                            expiryDate >= startDate &&
                            expiryDate <= endDate
                        );
                    })
                }));

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                success: true,
                                days,
                                totalProducts: result.length,
                                products: result
                            })
                        }
                    ]
                };

            } catch (error) {
                console.error("getProductsByDays:", error);

                return {
                    isError: true,
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                success: false,
                                message: error.message
                            })
                        }
                    ]
                };
            }
        }
    );
}


function getProductByName(server) {
    server.registerTool(
        "getProductByName",
        {
            description:"find the product belongging to a user whose name is provided by the user",

            inputSchema:{
                userId: z.string().min(1),
                productName: z.string().min(1)
            }
        },

        async ({userId, productName}) => {
            try {
                
                const product = await productModel.findOne({
                    userId,
                    productName: {
                        $regex: `^${productName}$`,
                        $options: "i"
                    }
                })
                
                console.log(product)

                return {
                    content:[
                        {
                            type: "text",
                            text :JSON.stringify({
                                success : true,
                                productData: product
                            })
                        }
                    ]
                }


            } catch (error) {
                console.error("getProductByName:", error);

                return {
                    isError: true,
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                success: false,
                                message: error.message
                            })
                        }
                    ]
                };
            }
        }
    )
}

function getProductByMonths(server){
    server.registerTool(
        "getProductByMonths",
        {
            description: "find the products whose warranty will expire whithin specified months",
            inputSchema:{
                userId: z.string().min(1),
                months: z.number().int().min(1).max(36)
            }
        },

        async ({userId ,months}) => { 
            try {
                const startDate = new Date();
                startDate.setHours(0, 0, 0, 0);

                    // Calculate target month and year
                const targetYear =
                    startDate.getFullYear() +
                    Math.floor((startDate.getMonth() + months) / 12);

                const targetMonth =
                    (startDate.getMonth() + months) % 12;

                    // Handle month-end dates safely
                const lastDayOfTargetMonth = new Date(
                    targetYear,
                    targetMonth + 1,
                    0
                ).getDate();

                const targetDay = Math.min(
                    startDate.getDate(),
                    lastDayOfTargetMonth
                );

                const endDate = new Date(
                    targetYear,
                    targetMonth,
                    targetDay,
                    23, 59, 59, 999
                );

                const products = await productModel.find({
                    userId,
                    warranty: {
                        $elemMatch: {
                            expiryDate: {
                                $gte: startDate,
                                $lte: endDate
                            }
                        }
                    }
                })
                .select(
                    "productName brand category purchaseDate purchasePrice warranty"
                )
                .sort({
                    "warranty.expiryDate": 1
                })
                .lean();

                const result = products.map(product => ({
                    ...product,
                    warranty: product.warranty.filter(item => {
                        const expiryDate = new Date(item.expiryDate);

                        return (
                            expiryDate >= startDate &&
                            expiryDate <= endDate
                        );
                    })
                }));

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                success: true,
                                months,
                                startDate,
                                endDate,
                                totalProducts: result.length,
                                products: result
                            })
                        }
                    ]
                };

            } catch (error) {
                console.error("getProductsByMonths:", error);

                return {
                    isError: true,
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                success: false,
                                message: error.message
                            })
                        }
                    ]
                };
            }
        }
    );
}


module.exports = {
    productsByDays,
    getProductByName,
    getProductByMonths
};





//  "getProductsByBrand",

//  "getProductsByExpiryDate",
//  "getProductsByPurchaseDate",