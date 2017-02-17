// Requires everything you need, including Mongoose
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");
var passport = require("passport");
// Put all of your routes in another file
var routes = require("./routes");
var setUpPassport = require("./setuppassport");

var app = express();

//Connects to your MongoDB Server in the test database
mongoose.connect("mongodb://localhost:27017/test");
setUpPassport();

app.set("port",path.join(__dirname,"views"));
app.set("view engine","ejs");

//Use four middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
    secret: "TKUN=JNJN*BDN@*@($JBJH*YUBJJVT%^^TGU)",
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.listen(3000),function(){
    console.log("Server started on port" + app.get("port"));
};


















































