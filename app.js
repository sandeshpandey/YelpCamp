const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const flash = require('connect-flash');

const seedDB = require("./seeds/seeds2");

const User = require('./models/user');
const Campground = require("./models/campground");
const Comment = require("./models/comment");


const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/camgrounds');
const indexRouters = require('./routes/index')

// seedDB();

//=======================
//Mongoose Model Config
//=======================

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/yelp_camp",{
        useNewUrlParser:true,
        useUnifiedTopology: true
});

//flash message
app.use(flash());

//=======================
//Passport Config
//=======================
const passport = require('passport');
const LocalStrategy = require('passport-local');
app.use(require("express-session")({
        secret:"Nepal is a Beautiful Country",
        resave: false,
        saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//=======================
//App Config
//=======================

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));


//pass user to the view (User auth)
app.use( (req, res, next)=>{
        res.locals.currentUser = req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
        next();
});




//routes
app.use(indexRouters);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);





//=====================
// Middleware
//=====================



//=======================
//Routes
//=======================











app.listen (3000,()=>{
	console.log("YelCamp Server Has Started");
});