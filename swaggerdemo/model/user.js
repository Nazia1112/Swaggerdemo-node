const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

userSchema = new Schema({
    firstname: {
        type: String
    },
    resume_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'nbResume',
        default:null
    },
    lastname: {
        type: String
    },
    username:{
        type: String,
        unique:true
    },
    password:{
        type: String
    },
    address: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: Number
    },
    location:{
        type:String
    }

});



module.exports = mongoose.model('nbUsers', userSchema);