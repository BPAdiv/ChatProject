//import colection schema
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body
        const hash = await bcrypt.hash(password, 10)
        const newUser = new User({ email, password: hash })
        console.log(req.body);
        newUser.save((err, user) => {
            if (err) {
                res.status(401).json({ alreadyUse: true })
            }
            else {
                User.find()
                    .then(users => {
                        const usersName = users.map(item =>
                        ({
                            _id: item._id,
                            email: item.email
                        })
                        )
                        const token = jwt.sign({ id: user._id }, process.env.TOKEN)
                        res.status(200).json({ message: "user created", data: user, token, allUsers: usersName })
                    })
            }
        })
    } catch (error) {
        res.status(400).json({ message: "cant use it" })

    }
}

exports.login = async (req, res) => {
    const loginUser = await User.findOne({ email: req.body.email })
    if (!req.body.email) {
        res.status(401).json({ message: false })
        console.log(req.body.email + "und");
    } else
        if (loginUser == null) {
            res.status(401).json({ message: false })
        } else {
            bcrypt.compare(req.body.password, loginUser.password)
                .then((rs) => {
                    if (!rs) {
                        res.status(401).json({ message: false })
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
        // if (!token) return;
        if (token) {
            jwt.verify(token, process.env.TOKEN, async function (err, decoded) {
                if (err) {
                    res.status(400).send(err)
                } else if (decoded.id == userId) {
                    User.
                        findOne({ _id: userId })
                        .exec(function (err, user) {
                            if (err) { res.status(400).json({ message: err }) }
                            else {
                                User.find({}, "email")
                                    .then(users => {
                                        console.log(users);
                                        res.status(200).json({ data: user, allUsers: users })
                                    })
                            }
                        })
                }
            })

        }
    } catch (error) {
        res.status(400).send(error)
    }

}
