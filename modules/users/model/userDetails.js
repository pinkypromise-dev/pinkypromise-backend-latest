let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
    },
    mobilenumber: {
        type: String,
    },
    defaultLanguage: {
        type: String
    },
    otp: {
        type: Number
    },
    username: {
        type: String
    },
    dob: {
        type: String
    },
    gender: {
        type: String
    },
    height: {
        measure: Number,
        unit: String
    },
    weight: {
        measure: Number,
        unit: String
    },
    healthissue: [{
        name: String,
        id: Schema.Types.ObjectId
    }],
    chatroomperference: [
        {
            name: String,
            id: Schema.Types.ObjectId
        }
    ],
    address: {
        type: String
    },
    acceptterms: {
        type: Boolean,
        default: false
    },
    mobilenumberverified: {
        type: Boolean,
        default: false
    },
    rememberme: {
        type: Boolean,
        default: false
    },
    profilecomplete: {
        type: Boolean,
        default: false
    },
    divicetoken: {
        type: Array
    },
    socialmedialogintype: {
        type: String,
        default: "NORMAL"
    },
    socialmedialoginid: {
        type: String
    },
    IsSocialMedia: {
        type: Boolean,
        default: false
    }
}, {
        timestamps: true
    });

module.exports = mongoose.model('Userdetails', UserSchema);