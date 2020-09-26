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
                    //add the comment rate the camp rate 
                    //the rate will be added --only-- if it wasn't done by the owner of the campground
                    //post 
                    if( ! newComment.author.id.equals(camp.author.id)){
                        //add the rate to the new comment 
                        //changing zero _default_ to the rate 
                        newComment.rate = parseInt(req.body.commentRate);
                        camp.rating.totalRate += newComment.rate % 6 ;
                        camp.rating.usersRated ++ ;
                        console.log(`new rate is added with following : the rate from comments = ${newComment.rate} total rateof camp :
                         ${ camp.rating.totalRate} number of users : ${camp.rating.usersRated}`)
                        newComment.save();
                    }

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
    Comment.findById(req.params.commentID  , (err , foundComment) =>{
        if(!err){
        foundComment.text = req.body.commentText ;
            Camp.findById(req.params.id , (err, foundCamp) => {
                if (!err){
                    if( ! foundComment.author.id.equals(foundCamp.author.id)){
                    //remove the old value of the rate o fthe comment from totaly comments
                    let oldRate = foundComment.rate ;
                    foundCamp.rating.totalRate -= oldRate ;
                    //update the newvalue of the comment 
                    foundComment.rate = parseInt(req.body.commentRate)
                    console.log("comment rate" , foundComment.rate)
                    //add the new value to the total rate of the camp
                    foundCamp.rating.totalRate += foundComment.rate ;
                    foundCamp.save();
                    foundComment.save();
                    }else{
                        foundComment.save();
                    }
                }
            });
            
        res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});
//delteing the comment 
router.delete("/:commentID", middleware.CanUserAlterComment,(req , res) => {
    var authorizedUser = req.user ;
    Camp.findById(req.params.id , (err, ownerCamp) =>{
        if(!err){
            //deleting the comment from user activity list
            authorizedUser.comments.forEach( (comment , index) => {
                if(comment._id.toString() === req.params.commentID ){
                    authorizedUser.comments.splice(index,1);
                    authorizedUser.save();
                }
            });
            //deleting the comment from the Camp comment list
            ownerCamp.comments.forEach( (comment , index) => {
                if(comment._id.toString() === req.params.commentID ){
                    ownerCamp.comments.splice(index,1);
                    
                    return
                }
            });
            //remove the rate of the delted comment from the total rate pf the camp
            //that make the data always right and can be updated
            Comment.findById(req.params.commentID , (err , comment)=>{
                if(!err){
                    //note that the camp owner can't rate so if he deleted his comment
                    //noting should happen
                    if( ! comment.author.id.equals(ownerCamp.author.id)){
                    ownerCamp.rating.totalRate -= comment.rate ;
                    ownerCamp.rating.usersRated -- ;
                    }
                }
            });
            ownerCamp.save();
            //finally remove the comment from the comment collection in DB 
            Comment.findByIdAndRemove(req.params.commentID , (err)={});
            req.flash("warning", "Comment deleted!  ");
            res.redirect("/campgrounds/"+ req.params.id);
        }
    })
})



module.exports = router ;