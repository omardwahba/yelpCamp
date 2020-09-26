var mongoose  = require('mongoose');

var campSchema = mongoose.Schema({
    name:String,
    url:String,
    discription : String , 
    shortDiscrip :String,
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
            default: 0
        }
    }
});
campSchema.pre("save", function (next) {
    console.log(`here in the MIDDLE WARE ${this.rating.totalRate} users rate ${this.rating.usersRated}`) ;
    if( this.rating.totalRate > 0 && this.rating.usersRated > 0){
        console.log("calculating rate");
        this.rating.rate = ( this.rating.totalRate / this.rating.usersRated).toFixed(1);
        console.log(`rate updated  for camp ${this.name} = ${this.rating.rate}`);
    }
    next();
  })
//creat a campGround class to define data collection


module.exports = mongoose.model('Camp',campSchema) ;