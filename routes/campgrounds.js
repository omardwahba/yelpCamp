var express = require("express"),
    router  = express.Router(),
    middleware = require("../middleware") ;

var Camp = require("../modules/campground");
const user = require("../modules/user");

router.get('/',function(req, res){
    Camp.find({}, function (err , camps) {
        if(err) console.log('error retreving camps from DB');
        else{
            res.render('campgrounds/campground', {camps : camps});
        }
      });
    
});

router.get('/new', middleware.isLoggedIn,  function(req, res){
    res.render('campgrounds/newCamp');
});

router.post('/', middleware.isLoggedIn,function(req, res){
    var newCamp = req.body.camp ;
    newCamp.author = {} ;
    newCamp.author.id = req.user._id ;
    newCamp.author.name = req.user.username ;
    Camp.create(newCamp, function (err , camp) {  
        if(err) console.log('failed adding new camp');
        else{
            console.log('a new camp is added' , camp);
            //add this camp to his creator 
            req.user.camps.push(camp);
            req.user.save((err, user) =>{
                console.log("added a camp for user" , user.username)
            });
            //flashing a msg that camp with created 
            req.flash("success", "<strong>Created a Campground!</strong> have a nice day")
            res.redirect('/campgrounds');
            

        }
    });
});
//show route 
router.get('/:id', (req , res) => {
    //we must populate the camps so that the comments is in it
    // console.log(req.params.id);
    Camp.findById(req.params.id).populate("comments").exec( (err, foundCamp) => {
    //  console.log(foundCamp);
        if(err) console.log('error finding the camp : ', err);
        else {
            res.render('campgrounds/show', {camp:foundCamp}) ;
        }
    })
})

//update route 
router.get("/:id/edit", middleware.CanUserAlterPost,  (req ,res) =>{
    Camp.findById(req.params.id , (err , foundCamp) => {
        if(err) {console.log("error finding the camp"); res.redirect("/campgrounds")}
        else {
            res.render("campgrounds/edit", {camp : foundCamp});
        }
    });

});
//handle the update route 
router.put("/:id" , middleware.CanUserAlterPost, (req , res) => {
    Camp.findByIdAndUpdate(req.params.id , req.body.camp , (err, updatedCamp)=>{
        if(err){
            console.log("error updating the camp");
        }else{
            updatedCamp.createdTime = Date.now();
            updatedCamp.save();
            //flasing a sucees msg
            req.flash("info" , "<strong> updated! the campground successfuly</strong>");
            res.redirect("/campgrounds/"+ updatedCamp._id);
        }
    })
})
//handle the delete request 
router.delete("/:id" , middleware.CanUserAlterPost,  (req ,res) => {
    Camp.findByIdAndRemove(req.params.id , (err)=> {
        if(err){
            console.log("error removing the campground");
        }else {
            req.user.camps.forEach( (campID , index) => {
                if (campID.toString() === req.params.id){
                    req.user.camps.splice(index,1);
                    req.user.save();
                    //flash delet msg 
                    req.flash("warning" , "<strong> Deleted!</strong> the campground :( ");
                    res.redirect("/campgrounds");
                    return
                    }
            });
        }
    })
})
//authrization middle ware 


module.exports = router ;