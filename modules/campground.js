var mongoose  = require('mongoose');

var campSchema = mongoose.Schema({
    name:String,
    url:String,
    discription : String , 
    shortDiscrip : String,
    pricePerNight : {
        type :Number ,
        default : 0
    },
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
    },
    rating : {
        totalRate : {
            type : Number,
            default : 0
        },
        usersRated :{
            type : Number,
            default : 0
        },
         rate: {
            type : Number,
            default: ()=>{
                if(this.usersRated > 0 && this.totalRate > 0)
                    return (this.totalRate/this.usersRated).toFixed(1);
                return 0
            }
        }
    }
});
//creat a campGround class to define data collection


module.exports = mongoose.model('Camp',campSchema) ;