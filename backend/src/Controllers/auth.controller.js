const userModel = require("../Schema/userModel")
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


async function loginController(req , res) {

    try {

        const {email ,  password} = req.body;

        if(!email || !password){
            return res.status(401).json({
                message : "Enter all required details"
            })
        }

        const user = await userModel.findOne({email});

        
        if(!user){
            return res.status(404).json({
                message : "user not exist"
            })
        }

        const isPassValid =await bcrypt.compare(password , user.password)

        if(!isPassValid){
            return res.status(409).json({message : "Password is not valid "})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_KEY)

        res.cookie("token" , token);

        res.status(200).json({
            message: "login successfull",
            user: {
                id : user._id,
                name : user.name,
                email : user.email,
            }
        })

        
    } catch (error) {
        console.log(`error ${error}`)

        res.status(401).json({message : `error ${error.message}`})
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
 
        res.status(200).json({
            message : "user data",
            user: {
                id: user._id,
                name : user.name,
                email : user.email
            }
        })

    } catch (error) {
        console.log(`error ${error}`)

        res.status(401).json({message : `error ${error.message}`})
    }
}


async function logoutController(req , res) {
    
    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(409).json({
                message : "token not defined"
            })
        }

        res.clearCookie("token", {
            path: "/"
        });

        return res.status(200).json({
            message: "Logout successful"
        });


    } catch (error) {
        console.log(`error ${error}`)

        res.status(401).json({message : `error ${error.message}`})
    }
}


module.exports = {
    registerUserController,
    loginController,
    getMeController,
    logoutController
}