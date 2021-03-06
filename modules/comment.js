var moongose  = require('mongoose');

var commmentSchema = moongose.Schema({
    text : String,
    author: {
        id : {
            type : moongose.Schema.Types.ObjectId,
            ref  : "User"
        },
        name : String
    },
    commentTime : {type : Date , default : Date.now()} ,
    rate : {
        type : Number ,
        default : 0
    }
});

module.exports =  moongose.model('Comment', commmentSchema) ;