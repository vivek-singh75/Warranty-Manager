const userModel =require("../DB/db")

async function registerUserController(req , res) {
    try {
        const {name , email , password} = req.body

        const isUserAlreadyExist = await userModel.find({email})

        if(isUserAlreadyExist){
            return res.status(400).json({message : "user already exist "})
        }

        



    } catch (error) {
        
    }
}


module.exports = {
    registerUserController,

}