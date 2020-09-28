var express = require("express"),
    router  = express.Router();

var User = require("../modules/user"),
    passport = require("passport");


router.get('/',function(req, res){
    res.render('landing');
});


//handle the new user 
    router.get("/register", (req ,res )=>{
        res.render("authen/register");
    });


    router.post("/register", (req , res) => {
        var newUser = new User({username : req.body.username});
        User.register( newUser , req.body.password , (err , user) => {
            if (err) {
                console.log("error in Registing" , err);
                //flashing an error msg 
                req.flash("danger",err.message);
                return res.redirect("/register");
            }
            passport.authenticate("local") (req , res , () => {
                console.log("new user added");
                //flashing an error msg 
                req.flash("success"," <strong>Registed successfully! </strong> welcome to YelpCamp "+ user.username);
                res.redirect("/campgrounds")
            });
        });
    });
     /*     logging in */ 
    router.get("/login", (req , res)=> {
         res.render("authen/login");
     });

     router.post("/login", passport.authenticate("local" , {
         successRedirect : "/campgrounds",
         failureRedirect:"/login",
         failureFlash: true,
         successFlash: `Logged you in successfuly welcome!`
        //  successFlash: 'Welcome!'
     }), (req , res) => {});
    
     //logout route 
     router.get("/logout", (req , res) => {
         req.logOut();
         res.redirect("/campgrounds");
     });
    



module.exports = router ;

 