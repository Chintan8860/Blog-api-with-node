const router = require('express').Router();
const verify = require('./verifyLogin')
const Topic = require('../model/Topic')


const Post = require('../model/Post')

// create Post
router.post("/post/:id", verify, async (req, res) => {
    const _id = req.params.id
    console.log(_id);
    try {
        const topic = await Topic.find({ _id: _id })
        if (!topic) {
            return res.status(404).send({ error: "Topic Not Found!!" })
        }
        // if(topic.length) ;
        if (req.body.title === null || req.body.title === '') return res.send({ error: "Title required!!!" })
        if (req.body.content === null || req.body.content === '') return res.send({ error: "Content required!!!" })
        if (req.body.title.length < 5) return res.send({ error: "Title Min length 5!!!" })
        if (req.body.content.length < 10) return res.send({ error: "Content Min length 10!!!" })


        const post = new Post({
            title: req.body.title,
            topic: topic[0]._id,
            content: req.body.content,
            createdBy: req.user
        })

        try {
            await post.save()
            res.status(201).send({ post })
        } catch (e) {
            res.status(400).send({ error: e.message })
        }

    } catch (error) {
        return res.status(404).send({ error: "Something Wrong Make sure Pass All value!!!" })
    }


})

// Get All post 
router.get('/post', (req, res) => {
    Post.find({}, (err, result) => {
        if (err) return res.status(400).send({ error: err })
        res.status(200).send(result)
    })

});


// get Most Recent post
router.get('/post/recent', (req, res) => {

    //for Asc Order 1 and desc order -1
    //set limit => Show number of post
    //ex:- /post/recent?order=1&limit=2
    Post.find().sort({ createdAt: parseInt(req.query.order) }).limit(parseInt(req.query.limit)).find((err, result) => {
        if (err) return res.status(400).send({ error: err })
        res.status(200).send(result)
    })

});

// Get post by topic
router.get('/post/:id', (req, res) => {
    const _id = req.params.id

    Post.find({ topic: _id }, (err, result) => {
        if (err) return res.status(400).send({ error: "Post Not Found!!" })
        res.status(200).send(result)
    })

});

//edit Post by post id
router.patch('/post/:id', verify, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["title", "content", "topic"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const result = await Post.findOne({ _id: req.params.id })
        const topicId = req.body.topic
        const title = req.body.title
        const content = req.body.content
        updates.forEach((update) => result[update] = req.body[update])
        if (title) {
            if (req.body.title === null || req.body.title === '') return res.send({ error: "Title required!!!" })
            if (req.body.title.length < 5) return res.send({ error: "Title Min length 5!!!" })
        }
        if (content) {
            if (req.body.content === null || req.body.content === '') return res.send({ error: "Content required!!!" })
            if (req.body.content.length < 10) return res.send({ error: "Content Min length 10!!!" })
        }
        if (!topicId) {
            await result.save()
            if (!result) {
                return res.status(404).send()
            }
            res.send(result)
        }
        try {
            const topic = await Topic.findById({ _id: topicId })
            if (!topic) return res.status(404).send({ error: "Topic Not Found!!" })
            await result.save()
            if (!result) {
                return res.status(404).send()
            }

            res.send(result)

        } catch (error) {
            return res.status(404).send({ error: "Topic Not Found!!" })
        }



    } catch (error) {
        console.log({ error: "Post Not Updated!!!" });
        res.status(400).send()
    }
})



//Delete Post by post id
router.delete('/post/:id', verify, async (req, res) => {

    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, createdBy: req.user })

        if (!post) {
            return res.status(404).send({ error: "Post not Found" })
        }

        res.send({
            Msg: "Post Deleted Sucessfully!!!",
            DeletedPost: post
        })
    } catch (error) {
        res.status(500).send({ error })
    }
})

module.exports = router;