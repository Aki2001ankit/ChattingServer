const asyncHandler = require("express-async-handler");
const Message = require("../model/messagemodel");
const User = require("../model/usermodel");
const Chat = require("../model/chatmodel");
const Noti = require("../model/notifModel")

const SendMessage = asyncHandler(async(req, res) => {
    try {
        const { content, chatId } = req.body;
        var newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId,
        }

        var message = await Message.create(newMessage);
        message = await message.populate("sender", "name email pic");
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select: "name email pic"
        });
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        }, { new: true })
        return res.status(201).send(message)
    } catch (err) {
        return res.status(401).send("can't send message")
    }

})
const GetAllMessage = asyncHandler(async(req, res) => {
    try {
        const message = await Message.find({ chat: req.params.chatId }).populate("sender", "name email pic").populate("chat")
        return res.status(201).send(message)
    } catch (err) {
        return res.status(401).send("failed to fetch chats")
    }
});
const PostNotification = asyncHandler(async(req, res) => {
    try {
        const { sender, content, chat } = req.body;

        const isfound = await Noti.findOne({ sender: sender, content: content, chat: chat })
        if (isfound) {


        } else {

            const noti = await Noti.create({ userid: req.user._id, sender, content, chat })

        }

        var result = await Noti.find({ userid: req.user._id }).populate("sender", "name email pic").populate("chat")
        return res.status(201).send({ length: result.length, result: result })

    } catch (err) {
        console.log(err)
        return res.status(401).send(err)
    }

});
const GetNotification = asyncHandler(async(req, res) => {
    try {

        const result = await Noti.find({ userid: req.user._id }).populate("sender", "name email pic").populate("chat")

        return res.status(201).send(result)

    } catch (err) {
        return res.status(401).send(err)

    }
})
module.exports = { SendMessage, GetAllMessage, PostNotification, GetNotification };