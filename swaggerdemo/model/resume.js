
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const resume = new schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'nbUsers',
    },
    resume: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    qualifications: {

        value: {
            type: String
        },

        HighSchool: {
            value: {
                type: String
            },
            year: {
                type: Number
            },

            board: {
                type: String
            },
            subjects: {
                type: String
            },
            percentage: {
                type: Number
            }

        },
        InterMediate: {
            value: {
                type: String
            },
            year: {
                type: Number,
            },

            board: {
                type: String
            },
            subjects: {
                type: String
            },
            percentage: {
                type: Number
            }

        },
        Graduation: {
            value: {
                type: String
            },
            year: {
                type: Number
            },

            board: {
                type: String
            },
            subjects: {
                type: String
            },
            percentage: {
                type: Number
            }
        },
        PG: {
            value: {
                type: String
            },
            year: {
                type: Number
            },

            board: {
                type: String
            },
            subjects: {
                type: String
            },
            percentage: {
                type: Number
            }
        }

    }


},
    {
        timestamps: true
    });
var Resume = mongoose.model('nbResume', resume);
module.exports = Resume;