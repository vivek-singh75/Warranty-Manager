const express = require("express");

const NotifiRouter = express.Router()
const notfiControllers = require("../Controllers/notification.controller");
const authMiddlewares = require("../Middleware/auth.middleware")

NotifiRouter.get("/notification" , authMiddlewares.authMiddleware, notfiControllers.createNotification);


module.exports = NotifiRouter;