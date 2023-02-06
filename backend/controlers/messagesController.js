const Conversation = require("../models/conversation")
const Message = require("../models/message")
const ChatUser = require("../models/users")

exports.addMessage = (req, res) => {
    const newMessage = new Message(req.body)
    try {

        Conversation.findById({ _id: req.params.chatId })
            .then(conv => {
                conv.messages.push(newMessage)
                conv.save()
                    .then(rs => {
                        newMessage.save()
                            .then(msg => {
                                res.status(200).json({ msg, chat: rs })
                            })

                    })

            })
    } catch (error) {
        res.status(500).json({ error })
    }

}
