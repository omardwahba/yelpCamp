var mongoose            = require("mongoose"),
passportLocalMongoose   = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
    username : String ,
    password : String ,
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref  : "Comment"
        }
    ],
    camps : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref  : "Camp"
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);


