const mongoose = require("mongoose");

const MsgSchema = new mongoose.Schema({
    text: { type: String, required: true },
    sentBy: { type: String, required: true },
})
module.exports = mongoose.model("ChatMessages", MsgSchema)
