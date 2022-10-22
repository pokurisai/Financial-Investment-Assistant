// Load required packages
var mongoose = require("mongoose");
var bcrypt = require('bcryptjs')

var UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        password: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            match: /.+\@.+\..+/,
            unique: true,
            lowercase: true,
        },
        email_verified: {
            type: Boolean,
            default: false,
        },
        phone: {
            type: String,
            default: "",
        },
        dob: {
            type: Number,
            default: 0,
        },
        gender: {
            type: String,
            enum: ["m", "f", "o", ""],
            default: "",
        },
        isProfileCompleted: {
            type: Boolean,
            default: false,
        },

        address: {
            line1: {
                type: String,
                default: "",
            },
            line2: {
                type: String,
                default: "",
            },
            city: {
                type: String,
                default: "",
            },
            state: {
                type: String,
                default: "",
            },
            country: {
                type: String,
                default: "",
            },
            zip_code: {
                type: String,
            },
        },
        billingAddress: {
            line1: {
                type: String,
                default: "",
            },
            line2: {
                type: String,
                default: "",
            },
            city: {
                type: String,
                default: "",
            },
            state: {
                type: String,
                default: "",
            },
            country: {
                type: String,
                default: "",
            },
            zip_code: {
                type: String,
            },
        },
        location: {
            type: {
                type: String, // Don't do `{ location: { type: String } }`
                enum: ["Point"], // 'location.type' must be 'Point'
            },
            coordinates: {
                type: [Number],
            },
            //coordinates: [-73.856077, 40.848447]
        },
        //Note : account_status is only for admin use to enable and disable a user. By default it is 1
        account_status: {
            type: Number,
            default: 1,
        },
        account_verified: {
            type: Boolean,
            default: false,
        },
        wallet:{
            type: Number,
            default:10000
        },
        currency:{
            type: String,
            default:"$"
        },
        accountDeactivate: {
            type: Boolean,
            default: false,
        },
        accountDelete: {
            type: Boolean,
            default: false,
        },
        roles: {
            type: String,
            enum: ["admin", "user"],
            default : "user"
        },
        access_token:
        {
            token: { type: String },
            token_type: { type: String },
            isUsed: { type: Boolean, default: false },
        },
        provider: {
            type: String,
        },
        areasOfInterest: {
            type: Array,
            default: [],
        },
        title: {
            type: String,
        },
        aboutMe: {
            type: String,
        },
        isTourCompleted: {
            type: Boolean,
            default: false,
        },
        occupation: {
            type: String,
        },
        organization: {
            type: String,
        },
        yearsOfExperience: {
            type: Number,
        },
        languages: {
            type: Array,
        },
        documentUrl:{
            type: String,
        }
    },
    {
        strict: false,
        versionKey: false,
        usePushEach: true,
        timestamps: true,
    }
);

var User = (module.exports = mongoose.model("user", UserSchema));

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}
module.exports.getUserById = function ( id, callback){
    User.findById(id, callback)
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) {
            console.log(err);
            callback(err)
        };
        callback(null, isMatch);
    });
}
