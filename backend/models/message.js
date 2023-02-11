const mongoose = require("mongoose");

const MsgSchema = new mongoose.Schema({
    createdAt: { type: String, required: true },
    text: { type: String, required: true },
    sentBy: { type: String, required: true },
})
module.exports = mongoose.model("ChatMessages", MsgSchema)
