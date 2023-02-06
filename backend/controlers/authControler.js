//import colection schema
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
    try {


        const { email, password } = req.body
        const hash = await bcrypt.hash(password, 10)
        // const salt = bcrypt.genSaltSync(10)
        // const hash = bcrypt.hashSync(password, salt)
        const newUser = new User({ email, password: hash })
        console.log(req.body);
        newUser.save((err, user) => {
            if (err) {
                res.status(500).send(err)
            }
            else {
                const token = jwt.sign({ id: user._id }, process.env.TOKEN)

                res.status(200).json({ message: "user created", token, data: user })
            }
        })
    } catch (error) {
        res.status(400).json({ message: "cant use it" })

    }
}

exports.login = async (req, res) => {
    const loginUser = await User.findOne({ email: req.body.email })
    if (!req.body.email) {
        res.status(400).json({ message: "Cannot enter none" })
        console.log(req.body.email + "und");
    } else
        if (loginUser == null) {
            res.status(400).json({ message: "email not created" })
        } else {
            bcrypt.compare(req.body.password, loginUser.password)
                .then((rs) => {
                    if (!rs) {
                        res.status(400).json({ message: "Password didnt match" })
                    } else {
                        User.find()
                            .then(users => {
                                const usersName = users.map(item =>
                                ({
                                    _id: item._id,
                                    email: item.email
                                })
                                )
                                const token = jwt.sign({ id: loginUser._id }, process.env.TOKEN)
                                res.status(200).json({ message: "You are In", data: loginUser, token, allUsers: usersName })
                            })
                    }
                })
                .catch((err) => res.status(400).json({ message: err }))
        }
}
exports.verf = async (req, res) => {
    const token = req.body.token
    const userId = req.body.userId
    try {


        if (token) {
            jwt.verify(token, process.env.TOKEN, async function (err, decoded) {
                if (err) {
                    res.status(400).send(err)
                } else if (decoded.id == userId) {
                    // User.findById(userId,(err,user)=>)
                    User.
                        findOne({ _id: userId })
                        // .populate('cv')
                        .exec(function (err, user) {
                            if (err) { res.status(400).json({ message: err }) }
                            else {
                                User.find()
                                    .then(users => {
                                        const usersName = users.map(item =>
                                        ({
                                            _id: item._id,
                                            email: item.email
                                        })
                                        )

                                        res.status(200).json({ data: user, allUsers: usersName })
                                    })
                            }

                        })

                    // User.findOne({ _id: userId }, (er, user) => {
                    //     if (er) {
                    //         res.status(400).send(er)
                    //     } else if (user == null) {
                    //         res.status(400).json({ message: "not right" })
                    //     } else {
                    //         res.status(400).json({ data: user })
                    //     }
                    // })
                }
            })

        }
    } catch (error) {
        res.status(400).send(error)
    }

}
