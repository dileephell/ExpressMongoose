var passport = require("passport");
var User = require("./model/user");
var LocalStrategy = require("passport-local").Strategy;

module.exports = function() {
// serializeUser should turn a user object into an ID.You can call done with no error and the user's ID.
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    
// DeserializeUser should turn the ID into a user object.Once you'have finished,you can call done with any errors and the user Object.
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });
};

// Tells Passport to use a local strategy
passport.use("login", new LocalStrategy(function(username, password, done) {
 User.findOne({ username: username }, function(err, user) {
     if(err) {return done(err);}
// If there is no user with the supplied username,returns false with an error message.
     if(!user) {
         return done(null, false,{ message: "No user has that username!" });
     }
// Calls the checkPassword method you defined earlier in your User Model.         
     user.checkPassword(password, function(err, isMatch) {
         if(err) { return done(err);}
         if(isMatch) {
             return done(null, user); // If a match, returns the current user with no error
         } else {
             return done(null, false, { message:"Invalid Password" }); // If not a match, returns false with an error message
         }
     });
 });
}));















































