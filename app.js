var express          = require("express");
var app              = express();
var bodyParser       = require("body-parser"),
    mongoose         = require('mongoose'),
    flash            = require("connect-flash"),
    expressSession   = require("express-session"),
    passport         = require('passport'),
    localStratigy    = require('passport-local'),
    methodOverride   = require("method-override"),
    Camp             = require('./modules/campground'),
    Comment          = require('./modules/comment'),
    User             = require("./modules/user"),
    seedDB           = require('./seed');

/**** routes calling */
var campgroundsRoute = require("./routes/campgrounds"),
    commentRoute     = require("./routes/comments"),
    indexRoute       = require("./routes/index");

/* ===================
     App Configuration
     =====================*/

mongoose.connect('mongodb+srv://yelpCampDB:Q4dW2Y0Ro5c45dKm@babysetps.o3hdg.gcp.mongodb.net/yelpCamp?retryWrites=true&w=majority',{ useNewUrlParser: true,  useUnifiedTopology: true});
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use( expressSession({
    secret: "this code was devloped by wahba",
    resave : false ,
    saveUninitialized : false
}));
app.use(express.static(__dirname +'/public'));
app.use(methodOverride("_method"));
//setting the falsh pakage up
app.use(flash()); 
//passport intialization 
app.use(passport.initialize());
app.use(passport.session());
//stratgey of authentication
passport.use(new localStratigy(User.authenticate()));
//serialization of user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//seeding the data base with some intial data
// seedDB () ;
//injecting the currentUser in evry request
app.use((req, res, next) => {
    res.locals.currentUser = req.user ;
    res.locals.flash       = req.flash();
    next();
});
 // setting up the routes
app.use("/" , indexRoute);
app.use("/campgrounds", campgroundsRoute);
app.use("/campgrounds/:id/comments" ,commentRoute);


app.listen(3000, function(){
    console.log('Server has started');
});