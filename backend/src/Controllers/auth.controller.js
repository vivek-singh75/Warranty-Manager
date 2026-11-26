const userModel = require("../Schema/userModel");
const mongoose = require("mongoose")
const productModel=  require("../Schema/productModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
 

async function registerUserController(req , res) {
    try {
        const {name , email , password} = req.body

        if(!name || !email || !password){
            return res.status(400).json({
                message: "Enter all data"
            });
        }

        const isUserAlreadyExist = await userModel.findOne({email})

        if(isUserAlreadyExist){
            return res.status(400).json({message : "user already exist "})
        }

        const hashPass = await bcrypt.hash(password, 10);


        const user  = await userModel.create({
            name,
            email, 
            password : hashPass
        }); 

        res.status(200).json({
            message: "user created successfully",
            user:{
                id: user._id,
                name : user.name,
                email : user.email
            }
            
        });

    } catch (error) {
        console.log(`error arrived ${error}`)
        res.status(500).json({
            message : `error arrived ${error.message}`
        })
    }
}


async function loginController(req, res) {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await userModel.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPassValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPassValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}


async function getMeController(req , res) {
    try {
        const userId = req.user.id;

        if(!userId){
            return res.status(404).json({
                message : "userId not exist"
            });
        }

        const user = await userModel.findById(userId)

        if(!user){ 
            return res.status(404).json({
                message : "user not found"
            })
        }

        const productdata = (await productModel.find({userId})).length

        const totalProducts  = productdata.length


 
        res.status(200).json({
            message : "user data",
            user: {
                id: user._id,
                name : user.name,
                email : user.email
            },
            productdata
        })

    } catch (error) {
        console.log(`error ${error}`)

        res.status(401).json({message : `error ${error.message}`})
    }
}



async function logoutController(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/"
    });

    return res.status(200).json({
        success: true,
        message: "Logout successful"
    });
}

async function deleteAccountController(req , res) {
    try {
        const userId = req.user.id;
        const {password} = req.body;

        if(!userId){
            return res.status(409).json({
                success : false,
                message : "unauthorized access"
            });
        }

        if(!password){
            return res.status(400).json({
                success : false,
                message : "Please Enter Password"
            });
        }

        const user = await userModel.findById(userId).select("password");

        if(!user){
            return res.status(503).json({
                success : false,
                message : "unauthorized "
            });
        }

        const isPassValid =await bcrypt.compare(password , user.password);

        if(!isPassValid){
            return res.status(400).json({
                success : false,
                message : "Please Enter valdi Password"
            });
        }

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            await productModel.deleteMany(
                {userId},
                {session}
            );

            await userModel.findByIdAndDelete(
                 userId,
                {session}
            );

            await session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();

            throw error
        } finally{
            await session.endSession()
        }

        res.clearCookie("token" , {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/"
        })

        res.status(200).json({
            success : true ,
            message : "successfull"
        })
        

    } catch (error) {
        console.error("error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}



module.exports = {
    registerUserController,
    loginController,
    getMeController,
    logoutController,
    deleteAccountController
}