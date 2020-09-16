var mongoose  =  require ('mongoose');
var Comment = require("./modules/comment");
var Camp = require("./modules/campground");

var someCamps = [
    {
        name : 'meet el sodan',
        url : "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1918&q=80",
        discription : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis dignissimos quaerat magni quae, atque consectetur. Accusantium temporibus aut qui ut voluptas, quos, odit veritatis et atque possimus fuga velit placeat.",

    }, 
    {
        name : 'Mansoura',
        url : "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        discription : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis dignissimos quaerat magni quae, atque consectetur. Accusantium temporibus aut qui ut voluptas, quos, odit veritatis et atque possimus fuga velit placeat."

    }, 
    {
        name : 'Dahab',
        url : "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1006&q=80",
        discription : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis dignissimos quaerat magni quae, atque consectetur. Accusantium temporibus aut qui ut voluptas, quos, odit veritatis et atque possimus fuga velit placeat."
    },
    {
        name : 'atmya heights',
        url : "https://hobnobmag.com/wp-content/uploads/2017/08/HOBNOBMAG-Tentsile-Tree-Tent1-1.jpg",
        discription : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis dignissimos quaerat magni quae, atque consectetur. Accusantium temporibus aut qui ut voluptas, quos, odit veritatis et atque possimus fuga velit placeat."
    }

]

//remove all samples from data base 
 function retrunn (){
    Camp.deleteMany({}, (err) => {
        if(err) console.log("error removing the camps", err) 
        /*else {
            console.log("camps have been removed");
            someCamps.forEach( (camp) => {
                Camp.create(camp, (err, addCamp) => {
                    if (err) console.log('failed adding camps')
                    else{
                        var newComment =  Comment.create ({
                            text : "this camps is quite amazing as it is in Egypt My friends",
                            author : 'hamo'
                        }, (err , createdComment) => {
                            if(err) console.log(" can't create comment")
                            else {
                                //adding two comments for testing later 
                                addCamp.comments.push(createdComment);
                                addCamp.comments.push(createdComment);
                                addCamp.save((err, savedCamp) => {
                                    console.log('finally added a camp with comment .. call back hell wouf');
                                });
                            }
                        });

                    }
                })
            })
        }*/
    });


}

module.exports = retrunn ;