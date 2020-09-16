var Camp     = require("../modules/campground"),
    Comment  = require("../modules/comment");

var middlwareObj = {}

    middlwareObj.CanUserAlterComment = function  (req , res , next){
        if(! req.isAuthenticated() ){
            req.flash("danger" , "<strong>Login or Signup first</strong> to continue")
            return res.redirect("/login");
        }
        Comment.findById(req.params.commentID , (err , foundComment)=>{
            if(!err){
                if (foundComment.author.id.equals(req.user.id)){  //totaly the same as :req.user.id.toString() === foundCamp.author.id.toString()
                    return next();
                }
                req.flash("danger", "You are not authorized to do that");
                res.redirect("/campgrounds")
            }
        })
        
    }

    middlwareObj.CanUserAlterPost = function  (req , res , next){
        if(! req.isAuthenticated() ) {
            return res.redirect("/login");
            req.flash("danger" , "<strong>Login or Signup first</strong> to continue");
        }
        Camp.findById(req.params.id , (err , foundCamp)=>{
            if(!err){
                if (foundCamp.author.id.equals(req.user.id)){  //totaly the same as :req.user.id.toString() === foundCamp.author.id.toString()
                    return next();
                }
                req.flash("danger", "You are not authorized to do that");
                res.redirect("/campgrounds")
            }
        })
        
    }

    middlwareObj.isLoggedIn = function  (req, res , next) { 
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("danger" , "<strong>Login or Signup first</strong> to continue");
        res.redirect("/login") ;
     }






module.exports = middlwareObj ;