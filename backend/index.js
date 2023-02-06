const io = require('socket.io')(2000, {
    cors: {
        origin: ["http://localhost:3000"]
    }
})

let users = []

function AddUser(userId, socketId) {
    console.log(userId);
    !users.some((user) =>
        user.userId === userId) &&
        users.push({ userId, socketId }
        )
}
function removeUser(socketId) {
    users = users.filter(user => user.socketId !== socketId)
}
function getUser(recieveId) {
    return users.find(user => user.userId == recieveId)
}

io.on('connection', (socket) => {

    // socket.join(socket.id)
    console.log(socket.id);

    socket.on("addUser", (userId) => {
        AddUser(userId, socket.id)
    })

    console.log(socket, "connected");
    socket.on("send-message", ({ userId, recieveId, text }) => {
        console.log("this reciver ,", recieveId);
        const reciever = getUser(recieveId)
        console.log(" this recivers ", reciever);
        console.log("this users ,", users);
        io.to(reciever.socketId).emit("getMsg", {
            text: text,
            sentBy: userId
        })
        // console.log(message);
        // if (room == "") {
        //     socket.broadcast.emit("recieve-message", message)
        // } else {
        //     socket.to(room).emit("recieve-message", message)
        // }
    })
    socket.on("join-room", (room, callback) => {
        socket.join(room)
        callback(room)
    })
    socket.on("user-room", (userEmail) => {
        console.log(userEmail);
        socket.join(userEmail)
    })
    socket.on("disconnect", () => {
        removeUser(socket.id)
    })
})
const bodyParser = require("body-parser")
const cors = require("cors")
// const bodyParser=require("body-parser")
const express = require("express") //import express
const app = express() //set app AS calling express
const mongoose = require("mongoose") //import mongoose
require("dotenv").config()
const authController = require("./controlers/authControler") //import single schema
const CvController = require("./controlers/CvController")


const conversationController = require("./controlers/conversationController")
const messageController = require("./controlers/messagesController")


app.use(cors())
//Use mongoose to connect mongoDb DataBase
mongoose.connect(process.env.MONGO, {})
    .then(() => console.log("connected"))
    .catch((err) => {
        console.log("unsucc");
        console.log(err);
    })

app.use(bodyParser.json())
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.post("/register", authController.register) //if someone on "http:.../register" do the functions.
app.post("/login", authController.login) //if someone on "http:.../register" do the functions.
app.post("/verf", authController.verf) //if someone on "http:.../register" do the functions.

//chat
app.post("/conversation", conversationController.AddConv)
app.get("/conversation/:id", conversationController.getConv)
app.get("/friend/:friendId", conversationController.getFriendUser)
app.post("/messages/:chatId", messageController.addMessage)



//Tasks
app.post("/tasks/:id", CvController.addCV) //if someone on "http:.../register" do the functions.
app.put("/tasks/:id", CvController.updateCv) //if someone on "http:.../register" do the functions.
app.delete("/tasks/:id", CvController.removeCv) //if someone on "http:.../register" do the functions.
app.get("/tasks/:id", CvController.getCvs) //if someone on "http:.../register" do the functions.
app.patch("/tasks/:id", CvController.updateIsCompleted) //if someone on "http:.../register" do the functions.

app.listen(8000, () => console.log("listen on port 8000")) //Server











    // app.get("/",
    //     function (req, res) {
    //         res.send("Homepage")
    //     }
    // )
    // app.get("/about",
    //     function (req, res) {
    //         res.send("Homepage sadadad")
    //     }
    // )
    // app.get("/users",
    //     function (req, res) {
    //         res.send([{ user: "adiv", class: "CyberPro" }])
    //     }
    // )