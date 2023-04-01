const mongoose = require("mongoose");

const ChatModel = mongoose.Schema({
    ChatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: true },
    GroupDescription: { type: String },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    }, ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },

    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    profile: {
        type: String,
        default: "http://res.cloudinary.com/dmtlafcmw/image/upload/v1671808327/bg_bdrx8f.png",
    }
}, {
    timestamps: true
})
const Chat = mongoose.model("Chat", ChatModel);
module.exports = Chat;