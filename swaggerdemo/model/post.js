const mongoose = require('mongoose');

const schema = mongoose.Schema;
const postSchema = new schema({
    Provider_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'nbProviders'
    },
    appliedUsers_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'nbUsers'
        }
    ],
    jobTitle: {
        type: String,
        require: true
    },
    domain: {
        type: String,
        required: true
    },

    skills: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    expRequired: {
        type: Number,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    vacancy: {
        type: Number,
        require: true
    }
},
    {
        timestamps: true
    });

var posts = mongoose.model('nbPost', postSchema);
module.exports = posts;