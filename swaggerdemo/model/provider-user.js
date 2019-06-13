const mongoose = require('mongoose');
const schema = mongoose.Schema;
const providerSchema = new schema({
    companyName: {
        type: String,
        require: true,

    },
    domain: {
        type: String,
        require: true
    },
    estYear: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true,
    },
    empCount: {
        type: String,
        require: true
    },
    companyAddress: {
        type: String,
        require: true
    },
    email:{
        type: String,
        required:true
    }
},
    {
        timestamps: true
    });
var PUser = mongoose.model('nbProviders', providerSchema);
module.exports = PUser;