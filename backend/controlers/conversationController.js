const Conversation = require("../models/conversation")
const ChatUser = require("../models/users")
const GroupConv = require("../models/groupConv")



exports.AddConv = (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.recieveId]
    })
    try {
        Conversation.findOne({
            members: [req.body.senderId, req.body.recieveId],
        })
            .then(s => {
                if (s?.members == null) {
                    console.log(s);
                    newConversation.save()
                        .then(rs => {
                            console.log(rs);
                            res.status(200).json({ data: rs })
                        })
                } else {
                    console.log("tihs", req.body.recieveId);
                    console.log("this sisisisiis", s);
                    console.log(s.members);
                    res.status(500).json({ mess: "cobversation already exiest", data: s })

                }
            })
    } catch (error) {
        res.status(500).json(error)
    }
}
exports.getConv = (req, res) => {
    Conversation.find({
        members: { $in: [req.params.id] },
    }
    ).populate("messages")
        .then(rs => {
            res.status(200).json({ data: rs })
        })
        .then((err) => {
            if (err) {

                res.status(500).json(err)
            }
        })
}

exports.getFriendUser = (req, res) => {
    ChatUser.findOne({ _id: req.params.friendId })
        .then(rs => {
            console.log(rs);
            res.status(200).json({ data: rs })
        })
        .catch(err => {
            if (err) {

                res.status(500).json({ err })
            }
        })
}





exports.addGroupConv = async (req, res) => {
    // if (req.body.members || req.body.convName == false) return console.log("noooo");


    const newGroupConv = new GroupConv({
        convName: req.body.convName,
        members: req.body.members
    })
    try {
        const newGroup = await newGroupConv.save()
        console.log(newGroup);
        res.status(200).json({ groupConv: newGroup })

        // .then(rs => {
        //     console.log(rs);
        //     res.status(200).json({ data: rs })
        // })


        // GroupConv.findOne({
        //     members: [req.body.senderId, req.body.recieveId],
        // })
        //     .then(s => {
        //         if (s?.members == null) {
        //             console.log(s);
        //             newGroupConv.save()
        //                 .then(rs => {
        //                     console.log(rs);
        //                     res.status(200).json({ data: rs })
        //                 })
        //         } else {
        //             console.log("tihs", req.body.recieveId);
        //             console.log("this sisisisiis", s);
        //             console.log(s.members);
        //             res.status(500).json({ mess: "cobversation already exiest", data: s })

        //         }
        //     })
    } catch (error) {
        res.status(500).json(error)
    }
}