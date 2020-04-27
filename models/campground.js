const mongoose = require('mongoose');

//Schema SSETUP

const campgroundsSchema = new mongoose.Schema({
    name:String,
    image:String,
    price:String,
    description: String,
    author : {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username : String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

const Campground = mongoose.model("Campground",campgroundsSchema);


module.exports = Campground;