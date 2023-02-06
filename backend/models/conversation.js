const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({

    members: [{ type: String, required: true }],
    messages: [{
        type: mongoose.Types.ObjectId,
        ref: "ChatMessages"
    }]

})
module.exports = mongoose.model("ChatConversation", RoomSchema)