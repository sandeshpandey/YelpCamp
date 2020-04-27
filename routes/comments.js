const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');




//Comments New
router.get("/new", middleware.isLoggedIn,(req, res)=>{
        Campground.findById(req.params.id,(err, campground)=>{
                if(err || !campground){
                        req.flash("error",err.message);
                        console.log(err);
                }else{
                        res.render("comments/new",{campground:campground})
                }
        })
});


//Comments Create
router.post("/", middleware.isLoggedIn,(req, res)=>{
        Campground.findById(req.params.id,(err, campground)=>{
                if(err || !campground){
                        req.flash("error",err.message);
                        console.log(err);
                        res.redirect("/campgrounds/"+campground._id);
                }else{
                        Comment.create(req.body.comment, (err, comment)=>{
                                if(err){
                                        req.flash("error",err.message);
                                        console.log(err)
                                }else{
                                        //add username and id to comment
                                        comment.author.id = req.user._id;
                                        comment.author.username = req.user.username;
                                        comment.save();
                                        //save comment
                                        campground.comments.push(comment);
                                        campground.save();
                                        res.redirect("/campgrounds/"+campground._id);
                                }
                        })
                }
        })
});



//Edit- edit page

router.get("/:comment_id/edit", middleware.checkCommentsOwnership, (req,res)=>{
        const id = req.params.id;
        Comment.findById(req.params.comment_id, (err,comment)=>{
                if(err || !comment){
                        req.flash("error",err.message);
                        console.log(err);
                        res.redirect("back");
                }else{
                        res.render("comments/edit",{comment:comment,campground_id:id});
                }
        });
});

//Update - update comment
router.put("/:comment_id", middleware.checkCommentsOwnership, (req, res)=>{
        Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,comment)=>{
                if(err){
                        console.log(err);
                        res.redirect("back");
                }else{
                        res.redirect("/campgrounds/"+req.params.id);
                }
        });
});

router.delete("/:comment_id", middleware.checkCommentsOwnership, (req, res) => {
        Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
                if (err){
                        console.log(err);
                        res.redirect("/campgrounds/"+req.params.id);
                }else{
                        res.redirect("/campgrounds/"+req.params.id);
                }
        });
});



module.exports = router;