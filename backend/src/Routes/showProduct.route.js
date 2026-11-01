const express = require("express");

const showRouter = express.Router()

const authMiddleWares = require("../Middleware/auth.middleware");

const showProductControllers = require("../Controllers/showProducts.controller")



showRouter.post("/listProducts" ,
    authMiddleWares.authMiddleware,  showProductControllers.listproductsByQuery)

showRouter.get("/topProducts" ,
    authMiddleWares.authMiddleware,  showProductControllers.top10Products)



module.exports= showRouter