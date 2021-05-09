const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let newsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    likedUsers: {
        type: [],
        required: false
    },
    author: {
        type: String,
        required: true
    },
    favorites: {
        type: [],
        required: false
    },
    comments: [{
        author: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    }]
}, {versionKey: false});

module.exports = mongoose.model('news', newsSchema);
