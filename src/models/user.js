const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minlength:2,
        maxlength: 50,
    },
    surname:{
        type: String,
        required: true,
        trim: true,
        minlength:2,
        maxlength: 50,
    },
    emailAktif:{
        type: Boolean,
        default: false
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        trim: true,
        required: true,
    }
},{collection: 'users',timestamps:true});

const User = mongoose.model('User',UserSchema);

module.exports =User