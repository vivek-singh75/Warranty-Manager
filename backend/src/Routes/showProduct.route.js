const express = require("express");

const showRouter = express.Router()

const authMiddleWares = require("../Middleware/auth.middleware");

const showProductControllers = require("../Controllers/showProducts.controller")



showRouter.get("/listProducts" ,authMiddleWares.authMiddleware,  showProductControllers.listTopProducts)



module.exports= showRouter