const router = require('express').Router();
const Topic = require('../model/Topic')
const verify = require('./verifyLogin')

// Create New Topic

router.post("/topic", verify, async (req, res) => {
    if (req.body.name === null) return res.send({ error: "Topic name required!!!" })
    const topic = await Topic.findOne({ name: req.body.name })
    if (topic) return res.send({ error: "Topic Name Alredy Exits!!!" })

    const topics = new Topic({
        name: req.body.name,
        createdBy: req.user._id
    })

    try {
        await topics.save()
        res.status(201).send(req.body)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

//Get All topic
router.get("/topic/", async (req, res) => {
    Topic.find({}, (err, result) => {
        if (err) return res.status(400).send({ error: err })
        res.status(200).send(result)
    })
})

module.exports = router