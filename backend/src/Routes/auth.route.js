const express = require("express");
const authRouter = express.Router();


const authControllers = require("../Controllers/auth.controller");
const authMiddlewares = require("../Middleware/auth.middleware");



authRouter.post("/register" , authControllers.registerUserController);

authRouter.post("/login" , authControllers.loginController);

authRouter.get("/getMe" ,authMiddlewares.authMiddleware, authControllers.getMeController);

authRouter.post("/logout" , authControllers.logoutController);

authRouter.delete("/deleteAccount" ,authMiddlewares.authMiddleware, authControllers.deleteAccountController);


module.exports = authRouter
