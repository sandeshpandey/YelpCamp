const Campground = require('../models/campground')
const Comment = require('../models/comment')

const middlewareObj ={};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
        if(req.isAuthenticated()){

                const id= req.params.id;
                Campground.findById(id, (err,campground)=>{
                        
                        if(err || !campground){
                                req.flash("error", "Campground not found");
                                res.redirect("back");
                        }else{
                                if(campground.author.id.equals(req.user._id)){
                                        next();
                                }else{
                                        req.flash("error", "You don't have permission to do that");
                                        res.redirect("back");
                                }
                        }
                });
        }else{
                req.flash("error", "You nedd to be Logged in");
                return res.redirect("/login");
        }
};

middlewareObj.checkCommentsOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
            Campground.findById(req.params.id,(err,campground)=>{
                    if(err || !campground){
                            req.flash("error",err.message)
                            return res.redirect("back");
                    }else{
                        const id= req.params.comment_id;
                        Comment.findById(id, (err,comment)=>{
                                if(err || !comment){
                                    req.flash("error", "Comment not found");
                                    res.redirect("back");
                                }else{
                                        if(comment.author.id.equals(req.user._id)){
                                                next();
                                        }else{
                                            req.flash("error", "You don't have permission to do that");
                                            res.redirect("back");
                                        }
                                }
                        });
                    }
            })
    }else{
            req.flash("error", "You nedd to be Logged in");
            return res.redirect("/login");
    }
};

middlewareObj.isLoggedIn = (req, res, next) =>{
    if(req.isAuthenticated()){
            return next();
    }
    req.flash("error","You need to be logged in");
    res.redirect("/login");
};

module.exports = middlewareObj;