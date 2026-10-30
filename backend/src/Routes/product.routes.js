const express = require("express");

const productRouter = express.Router();


const productControllers = require("../Controllers/product.controller");
const authMiddleWares = require("../Middleware/auth.middleware");


productRouter.post("/add" , authMiddleWares.authMiddleware ,  productControllers.addProduct);

productRouter.post("/submit" , authMiddleWares.authMiddleware ,  productControllers.submitProducts);
 
module.exports = productRouter;