const asyncHandler = require("express-async-handler");
const Chat = require("../model/chatmodel")
const User = require("../model/usermodel")


const AccessChat = asyncHandler(async(req, res) => {
        const { userid } = req.body
        const ans = await User.find({ _id: userid })
        if (!userid) {
            return res.status(401).send("Chat doesn't exist")
        }
        var isChat = await Chat.find({
            isGroupChat: false,
            users: { $all: [req.user, userid] }
        }).populate("users", "-password").populate("latestMessage");

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email"

        })

        if (isChat.length > 0) {
            return res.status(201).send(isChat[0]);
        } else {
            const Chatdata = {
                ChatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userid]
            };
            try {
                const createchat = await Chat.create(Chatdata);

                const fullchat = await Chat.find({ _id: createchat._id }).populate("users", "-password");
                return res.status(201).send(fullchat)

            } catch (err) {
                return res.status(401).send("hello");

            }
        }

    })
    // getting all chat where user is involve.... user may have personal one to one chat as well as group chat
const FetchChat = asyncHandler(async(req, res) => {
    try {
        let result = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).populate("users", '-password').populate("groupAdmin", "-password").populate("latestMessage",
            "-password").sort({ updatedAt: -1 })

        result = await User.populate(result, {
            path: "latestMessage.sender",
            select: "name pic email"

        })
        return res.status(201).send(result)
    } catch (err) {
        return res.status(401).send("failed to fetch chat")
    }
})

// create groupchat
const CreateGroupChat = asyncHandler(async(req, res) => {
        if (!req.body.name || !req.body.users) {
            return res.status(401).send("please fill all the fields")
        }
        var users = JSON.parse(req.body.users);
        users.push(req.user)

        try {
            const groupchat = await Chat.create({
                ChatName: req.body.name,
                isGroupChat: true,
                GroupDescription: req.body.desc,
                users: users,
                groupAdmin: req.user,
                profile: req.body.pic
            })

            const fullgroupchat = await Chat.find({
                    _id: groupchat._id
                }).populate("users", "-password")
                .populate("groupAdmin", "-password")

            return res.status(201).send(fullgroupchat)
        } catch (err) {
            return res.status(401).send("failed to create a group")
        }
    })
    // renaming group
const RenameGroup = asyncHandler(async(req, res) => {
    try {
        const { chatid, chatname, desc } = req.body;
        const updatechat = await Chat.findByIdAndUpdate(
            chatid, { ChatName: chatname, GroupDescription: desc, }, { new: true }
        ).populate("users", "-password").populate("groupAdmin", "-password");
        if (updatechat) {
            return res.status(201).send(updatechat)
        } else {
            return res.status(401).send("failed to update")
        }
    } catch (err) {
        return res.status(401).send("failed to update")

    }
})

const ChangeGroupDP = asyncHandler(async(req, res) => {
    try {
        const { chatid, pic } = req.body;
        const updatechat = await Chat.findByIdAndUpdate(
            chatid, { profile: pic }, { new: true }
        ).populate("users", "-password").populate("groupAdmin", "-password");
        if (updatechat) {
            return res.status(201).send(updatechat)
        } else {
            return res.status(401).send("failed to update")
        }
    } catch (err) {
        return res.status(401).send("failed to update")

    }

})

const RemoveFromGroup = asyncHandler(async(req, res) => {
    try {
        const { chatid, userid } = req.body;
        const updatechat = await Chat.findByIdAndUpdate(
            chatid, { $pull: { users: userid } }, { new: true }
        ).populate("users", "-password").populate("groupAdmin", "-password");
        if (updatechat) {
            return res.status(201).send(updatechat)
        } else {
            return res.status(401).send("failed to update")
        }



    } catch (err) {
        return res.status(401).send("failed to update")
    }

})
const AddInGroup = asyncHandler(async(req, res) => {
    try {
        const { chatid, userid } = req.body;

        const updatechat = await Chat.findByIdAndUpdate(
            chatid, { $push: { users: userid } }, { new: true }
        ).populate("users", "-password").populate("groupAdmin", "-password");
        if (updatechat) {
            return res.status(201).send(updatechat)
        } else {
            return res.status(401).send("failed to update")
        }


    } catch (err) {
        return res.status(401).send("failed to update")

    }

})


module.exports = { AccessChat, FetchChat, CreateGroupChat, RenameGroup, ChangeGroupDP, RemoveFromGroup, AddInGroup }