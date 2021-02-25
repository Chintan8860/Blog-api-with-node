const router = require('express').Router();
const verify = require('./verifyLogin')
const Comment = require('../model/Comment')
const Post = require('../model/Post')

router.post("/post/:id/comment", verify, async (req, res) => {



    try {
        const result = await Post.findById(req.params.id)
        console.log(result);
        const comment = new Comment({
            comment: req.body.comment,
            postId: result._id,
            CommentBy: req.user
        });
        console.log(comment);
        await comment.save()
        res.status(201).send({
            comment: {
                commentMsg: req.body.comment,
                post: result
            }
        })
    } catch (error) {
        res.status(400).send({ error: "Post not found!!!", msg: "Enter proper details" })
    }
});
module.exports = router