const notificationModel = require("../Schema/notificationModel");
const productModel = require("../Schema/productModel")

async function createNotification(req , res) {
    try {
        const userId = req.user.id;

        const productData =  await findProduct(userId)


        res.status(200).json({
            success: true,
            productData
        })

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports=  {
    createNotification 
}

async function findProduct(userId) {
    try {
        const now = new Date();

        // Start of today (00:00:00.000)
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // End of the 7th day from today (23:59:59.999)
        const sevenDaysLater = new Date(startOfToday);
        //const eighthDayBefore = new Date(startOfToday)

        sevenDaysLater.setDate(startOfToday.getDate() + 7);
       //eighthDayBefore.setDate(startOfToday.getDate()+ 8);

        // sevenDaysLater.setHours(0o0, 0o0, 0o0, 0o00);
        sevenDaysLater.setHours(23, 59, 59 , 999);
        //eighthDayBefore.setHours(23, 59, 59 , 999);

        const products = await productModel.find({
            userId,
             "warranty.expiryDate":
            {
                $gte: startOfToday,
                $lte: sevenDaysLater
            }
        })
        .select("-userId -__v -purchaseDate -purchasePrice -warranty.type -warranty._id")
        .sort({ "warranty.expiryDate": 1 })
        .limit(5);

        return products;

    } catch (error) {
        console.error(error);
        return [];   // better than bare `return` (undefined)
    }
}