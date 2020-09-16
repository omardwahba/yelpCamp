var mongoose  = require('mongoose');

var campSchema = mongoose.Schema({
    name:String,
    url:String,
    discription : String , 
    //used here object refrencing to assotite the comments to camps posts 
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "Comment"
        }
    ] ,
    author : {
        id :{  
            type : mongoose.Schema.Types.ObjectId ,
            ref  : "User"
            },
        name : String
    },
    createdTime : {
        type : Date ,
        default : Date.now()
    }
});
//creat a campGround class to define data collection


module.exports = mongoose.model('Camp',campSchema) ;