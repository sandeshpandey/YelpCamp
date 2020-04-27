const mongoose = require('mongoose');

//Schema SSETUP

const commentsSchema = new mongoose.Schema({
    text:String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username:String
    }
});

const Comment = mongoose.model("Comment",commentsSchema);


module.exports = Comment;