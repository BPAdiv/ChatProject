const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    convName: { type: String, required: true },
    members: [{ type: String, required: true }],
    messages: [{
        type: mongoose.Types.ObjectId,
        ref: "ChatMessages"
    }]

})
module.exports = mongoose.model("ChatGroupConv", GroupSchema)