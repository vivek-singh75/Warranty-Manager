const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required : [true ,  "name is required"]
    },
    email :{
        type : String,
        required: [true , "Email is required to create account"],
        unique: true
    },
    password : {
        type: String ,
        required : true
    }

},{
    timestamps: true
})

const userModel = mongoose.Model("users" , userSchema)

module.exports = userModel