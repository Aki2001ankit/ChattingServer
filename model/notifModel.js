const mongoose = require("mongoose");
const NotiModel = mongoose.Schema({
    userid: { type: String },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: { type: String, trim: true },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    message: { type: Boolean, default: true }



}, {
    timestamps: true
})
const Noti = mongoose.model("Noti", NotiModel);
module.exports = Noti;