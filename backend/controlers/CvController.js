const { findByIdAndUpdate } = require("../models/conversation");
const Cv = require("../models/conversation")
const CVUser = require("../models/users")







exports.addCV = (req, res) => {
    try {
        console.log(req.body);
        const newCv = new Cv(req.body)
        // console.log(newCv);
        CVUser.findOne({ _id: req.params.id })
            .then((user) => {
                if (user) {
                    // console.log(user);
                    newCv.save((err, cv) => {
                        if (err) {
                            // console.log(cv);
                            res.status(500).json({ message: err })
                        } else {


                            console.log(newCv);
                            user.cv.push(newCv)
                            user.save((err, tuser) => {
                                if (err) {
                                    res.status(500).json({ message: err })
                                } else {
                                    res.status(200).json({ message: "Cv added success", data: tuser, cv })
                                }
                            })
                        }
                    })
                }
            })

    } catch (error) {
        res.status(500).json({ message: error })
        console.log(error);
    }

}

exports.updateCv = (req, res) => {

    Cv.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, task) => {
        if (err) {
            res.status(500).json({ message: err })
        } else {
            res.status(200).json({ message: "tasks update successfully", task })
        }
    })

}

exports.removeCv = (req, res) => {

    Cv.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.status(500).json({ message: err })
        } else {
            res.status(200).json({ message: "tasks deleted successfully" })
        }
    })

}
exports.getCvs = (req, res) => {
    console.log(req.params.id);
    CVUser.
        findOne({ _id: req.params.id })
        .populate('cv')
        .exec(function (err, tasks) {
            if (err) { res.status(400).json({ message: err }) }
            else res.status(200).json({ data: tasks })
        })

    // .then(rs => {

    //     console.log(rs)
    //     res.status(200).json({ message: rs })
    // })
    // exec(function (err, story) {
    //     if (err) return handleError(err);
    //     console.log('The author is %s', story);
    //     res.status(200).json({message:story})
    //     // prints "The author is Ian Fleming"
    // });
    // Task.find()
    //     .then((data) => {
    //         if (data) {
    //             res.status(200).json({ message: data })
    //         } else {
    //             res.status(500).json({ message: "There is no Tasks" })
    //         }
    //     })
    //     .catch((err) => res.status(500).json({ message: err }))
}

exports.updateIsCompleted = (req, res) => {
    Cv.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, task) => {
        if (err) {
            res.status(500).json({ message: err })
        } else {
            res.status(200).json({ message: "task completed succesddsad", task })
        }


    })


}
