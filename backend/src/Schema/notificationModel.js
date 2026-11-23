const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["message", "order", "comment", "system"],
        default: "system"
    },

    isRead: {
        type: Boolean,
        default: false
    },

    link: {
        type: String,
        default: ""
    }
}, { timestamps: true });


const notificationModel = mongoose.model( "Notification",  notificationSchema );

module.exports = notificationModel;