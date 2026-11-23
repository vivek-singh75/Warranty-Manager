const express = require("express");

const productRouter = express.Router();


const productControllers = require("../Controllers/product.controller");
const authMiddleWares = require("../Middleware/auth.middleware");


productRouter.post("/add" , authMiddleWares.authMiddleware ,  productControllers.addProduct);

productRouter.post("/submit" , authMiddleWares.authMiddleware ,  productControllers.submitProducts);

productRouter.post("/edit" , authMiddleWares.authMiddleware ,  productControllers.editProductController);

productRouter.delete("/delete/:id" , authMiddleWares.authMiddleware ,  productControllers.deleteProductController);


 
module.exports = productRouter;