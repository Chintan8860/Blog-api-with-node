const router = require('express').Router();
const Like = require('../model/Like')
const verify = require('../Auth/verifyLogin')
const Post = require('../model/Post')


// like post

router.post("/post/like/:id", verify, async (req, res) => {
    try {
        const result = await Post.findById({ _id: req.params.id })
        const like = new Like({
            likedBy: req.user,
            postId: result._id
        })

        const updates = Object.keys({ like: result.like + 1 })
        const allowedUpdates = ["like"]
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Like not updated!!!' })
        }
        try {
            await like.save()
            updates.forEach((update) => result[update] = result.like + 1)
            await result.save()
            if (!result) {
                return res.status(404).send({ error: 'Like not updated!!!' })
            }
            res.status(201).send(
                {
                    msg: "post Liked Successfully!!",
                    likedPost: {
                        postID: like._id, title: result.title
                    }
                })
        } catch (error) {
            res.status(400).send({ error: "post like opration is not done!!!" })
        }

    }
    catch (error) {
        res.status(404).send({ error: "Post Not Found!!!" })
    }
})

//Dislike post
router.post("/post/dislike/:id", verify, async (req, res) => {
    try {
        const result = await Post.findById({ _id: req.params.id })
        const dislike = new Like({
            dislikedBy: req.user,
            postId: result._id
        })
        try {
            await dislike.save()
            res.status(201).send(
                {
                    msg: "post disliked Successfully!!",
                    DislikedPost: {
                        postID: dislike._id, title: result.title
                    }
                })
        } catch (error) {
            res.status(400).send({ error: "post dislike opration is not done!!!" })
        }

    }
    catch (error) {
        res.status(404).send({ error: "Post Not Found!!!" })
    }
})

//Dislike post
router.get("/mostlike", async (req, res) => {

    //limit => number of post 
    Post.find().sort({ like: -1 }).limit(parseInt(req.query.limit)).find((err, result) => {
        if (err) return res.status(400).send({ error: err })
        res.status(200).send(result)
    })
})


module.exports = router