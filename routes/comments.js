var express = require("express"),
    router  = express.Router({mergeParams : true}),
    middleware = require("../middleware");



var Camp = require("../modules/campground"),
    Comment = require("../modules/comment");
const { models } = require("mongoose");

router.get('/new', middleware.isLoggedIn , (req, res) => {
    Camp.findById(req.params.id).populate('comments').exec( (err , foundCamp) => {
        if(err) console.log ('error in finding the camp before the commment');
        else{
            res.render('comments/new' , {camp : foundCamp});
        }
    });
});
router.post('/', middleware.isLoggedIn ,(req , res) =>{

    var createdComment = {
        text : req.body.commentText ,
        author : {
            id : req.user._id,
            name: req.user.username
        }
    }
    Comment.create( createdComment , (err , newComment) =>{
        if(err) console.log('error creating new comment')
        else{
            //push comment to it its user 
            req.user.camps.push(newComment);
            req.user.save((err, user) =>{
                console.log("added a comment for user" , user.username)
            });
            var camp = Camp.findById(req.params.id, (err, camp) => {
                if(err) console.log(err)
                else {
                    camp.comments.push (newComment);
                    camp.save((err, savedCamp) => {
                        if(err) console.log("can't save the camp with new comment")
                        else {
                            //flashing sucess msg 
                            // req.flash("info", "Comment added ");
                            res.redirect('/campgrounds/'+ req.params.id);
                        }
                    });
                }
            })
        }
    })
});
// update route for the commments
router.get("/:commentID/edit", middleware.CanUserAlterComment , (req ,res) => {
    Camp.findById(req.params.id , (err , foundCamp)=>{
        if(!err){
            console.log("searching for comment with id" , req.params.commentID);
            Comment.findById(req.params.commentID , (err, foundComment)=>{
                if(!err){
                    console.log("found the comment :" , foundComment);
                    res.render("comments/edit", {camp:foundCamp , comment:foundComment})
                }
            });
        }
    })
    
});

//comment edit logic handlinig 
router.put("/:commentID", middleware.CanUserAlterComment ,(req , res)=> {
    Comment.findByIdAndUpdate(req.params.commentID , {text : req.body.commentText} , (err , updatedComment) =>{
        if(!err){
        console.log("comment update successfuly");
        res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});
//delteing the comment 
router.delete("/:commentID", middleware.CanUserAlterComment,(req , res) => {
    var authorizedUser = req.user ;
    Camp.findById(req.params.id , (err, ownerCamp) =>{
        if(!err){
            authorizedUser.comments.forEach( (comment , index) => {
                if(comment._id.toString() === req.params.commentID ){
                    authorizedUser.comments.splice(index,1);
                    authorizedUser.save();
                }
            });
            ownerCamp.comments.forEach( (comment , index) => {
                if(comment._id.toString() === req.params.commentID ){
                    ownerCamp.comments.splice(index,1);
                    ownerCamp.save();
                    Comment.findByIdAndRemove(req.params.commentID , (err)=>{});
                    req.flash("warning", "Comment deleted!  ");
                    res.redirect("/campgrounds/"+ req.params.id);
                    return
                }
            });
        }
    })
})



module.exports = router ;