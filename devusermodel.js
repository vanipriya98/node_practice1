const mongoose =require("mongoose")
const devuser=new mongoose.Schema({
    fullName:{
        type:String,
        required : true
    },
    email :{
        type:String,
        required : true
    },
    mobile :{
        type:String,
        required : true
    },
    skill : {
        type:String,
        required : false
    },
    password :{
        type:String,
        required : true
    },
    confirmPassword :{
        type:String,
        required : true
    }
})

module.exports =mongoose.model('devuser',devuser)