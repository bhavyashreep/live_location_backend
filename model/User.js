const mongoose =require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        max:255
    },
    mobile:{
        type:String,
        required:true,
        max:10
    },
    password:{
        type:String,
        required:true,
        min:6
    },
    lat:{
        type:String,
        default:"",
    },
    lng:{
        type:String,
        default:"",
    }
});
module.exports =mongoose.model('User',userSchema)