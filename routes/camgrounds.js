const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require("../middleware");

//Middleware




//INDEX -- Show all campgrounds
router.get("/", (req,res)=>{
        
    //Get all campground from DB
    Campground.find({},(err, campgrounds)=>{
            if(err){
                    console.log(err);
            }else{
                    res.render("campgrounds/index",{campgrounds : campgrounds, currentUser: req.user})
            }
    });
});


//CREATE -- add new campground to DB
router.post("/",middleware.isLoggedIn,(req,res)=>{
let name = req.body.name;
    let image =req.body.image;
    let price = req.body.price;
    let description = req.body.description;
    let author = {
            id: req.user._id,
            username : req.user.username
    };
let newCampground = {name:name,image:image,price:price,description:description,author:author};
    
    //Create a new camgrounds into the DB
    Campground.create(newCampground,(err, newlyCreated) =>{
            if(err){
                req.flash("error",err.message);
                console.log(err);
                return res.redirect("back"); 
            }else{
                    res.redirect("/campgrounds")
            }
    });

});


//NEW - show form to create new campground
router.get ("/new", middleware.isLoggedIn,(req,res)=>{
res.render("campgrounds/new.ejs");
});

//SHOW -- show more info about one campground
router.get("/:id", (req,res)=>{
    const id = req.params.id;
    Campground.findById(id).populate("comments").exec((err,campground)=>{
            if(err || !campground){
                console.log(err);
                req.flash("error",err.message);
                res.redirect("back");         
            }       
            else{  
                    res.render("campgrounds/show",{campground:campground})
            }
    });
});


//Edit -- show edit page of campground

router.get("/:id/edit", middleware.checkCommentsOwnership, (req, res) =>{
        if(req.isAuthenticated()){

                const id= req.params.id;
                Campground.findById(id, (err,campground)=>{
                        
                        if(err || !campground){
                                req.flash("error",err.message);    
                                return res.redirect('/campground');
                        }else{
                                if(campground.author.id.equals(req.user._id)){
                                        res.render("campgrounds/edit",{campground:campground});
                                }
                                else{
                                       res.redirect("back");
                                }
                        }
                });
        }else{
                console.log("You nedd to be Logged in");
                return res.redirect("/login");
        }
        
});


//Update -- Update the campground

router.put("/:id", middleware.checkCampgroundOwnership,(req, res)=>{
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground)=>{
                if(err || !campground){
                        console.log(err);
                        req.flash("error",err.message);    
                        return res.redirect("/campgrounds/"+ req.params.id);
                }else{
                        req.flash("success","Campgroud edited successfully");
                        res.redirect("/campgrounds/" + req.params.id);
                }
        });
});


//Delete --  delete the campground
router.delete("/:id",middleware.checkCampgroundOwnership,(req, res)=>{
        Campground.findByIdAndRemove(req.params.id,(err)=>{
                if (err){
                        console.log(err);
                        req.flash("error",err.message)
                        return res.redirect("/campgrounds")
                }else{
                        res.redirect("/campgrounds")
                }
        })
});



module.exports = router;