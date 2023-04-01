const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");


const connectDB = require("./db/conn")
const userRouters = require("./Routes/userroutes")
const ChatRoutes = require("./Routes/chatroute")
const MessageRoutes = require("./Routes/messageroute")

const app = express();
dotenv.config();

connectDB();

app.use(express.json());

app.use(
    cors({
        origin: true,
        optionsSuccessStatus: 200,
        credentials: true,
    })
);


app.get('/', (req, res) => {
    res.send("hello from backend").status(200);

})

app.use('/api/user', userRouters)
app.use('/api/chat', ChatRoutes)
app.use('/api/message', MessageRoutes)

const port = process.env.PORT
const server = app.listen(port, console.log(`server is running at port no ${port}`));

const io = require("socket.io")(server, {
    pingTimeOut: 5000,
    cors: {
        origin: "http://localhost:3000",

    }
});
//''''''''''''''''''''deployment'''''''''''''''''''

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
    })
} else {
    app.get("/", (req, res) => {
        res.send("api is running")
    })
}

//''''''''''''''''''''deployment'''''''''''''''''''

io.on('connection', (socket) => {
    console.log("connected to socket.io");

    socket.on('setup', (userdata) => {
        socket.join(userdata._id);
        console.log(`connected to ${userdata._id}`)
        socket.emit("connected")

    })
    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("connected with " + room)
    })
    socket.on("sendMessage", (newMessage) => {
        var chat = newMessage.chat;
        if (!chat.users) return console.log("chat user is not defined");

        chat.users.forEach(user => {
            if (user._id === newMessage.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessage)
        })

    });
    socket.on("typing", (room) => {
        socket.in(room).emit("typing");
    });

    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing");
    });

})