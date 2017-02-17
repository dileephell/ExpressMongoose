var express = require("express");
var User = require("./models/user");
var passport = require("passport");

var router = express.Router();

//Sets useful variables for your templates
router.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

// Queries the users collection,returning the newest users first
router.get("/",function(req, res, next) {
    User.find()
     .sort({createdAt: "descending"})
     .exec(function(err,users) {
        if(err) {
            return next(err);
        }
        res.render("index",{users:users});
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/signup",function(req,res){
    res.render("signup");
});

// Body-parser adds the username and password to req.body
router.post("/signup",function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    
// Calls findOne to return just one user.You Want a match on usernames here.    
    User.findOne({username: username}, function(err,user) {
        if(err) {
            return next(err);
        }
        if(user) {
// If you find a user, you should bail out because that username already exists.            
            req.flash("error","User already exists");
            return res.redirect("/signup");
        }
//Creates a new instance of the User Model with the username and password
        var newUser = new User({
            username: username,
            password: password
        });
// Saves the new user to the database and continues to the next request handler        
        newUser.save(next);
    });
},passport.authenticate("login",{
    successRedirect : "/",
    failureRedirect : "/signup",
    failureFlash : true
}));

//Logging Out
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

// The profiles route
router.get("/users/:username",function(req, res, next) {
    User.findOne({username: req.params.username}, function(err, user){
        if(err) {return next(err);}
        if(!user) {return next(404);}
        res.render("profile",{user: user});
    });
});


function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()){ // a function provided by Passport
        next();
    } else {
        req.flash("info", " You must be logged in to see this page.");
        res.redirect("/login");
    }
}



module.exports = router;

















































