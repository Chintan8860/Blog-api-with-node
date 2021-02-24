var mongoose = require('mongoose')

var postSchema = new mongoose.Schema({
    title: {
        type: 'string',
        minLength: 5,
        required: true
    },
    topic: {
        type: 'string',
        ref: 'Topic'
    },
    content: {
        type: 'string',
        minLength: 10,
        required: true
    },
    comments: {
        type: 'string',
    },
    createdBy: {
        type: 'string',
        required: true

    }
}, { timestamps: true });

module.exports = mongoose.model("post", postSchema);