const jwt = require("jsonwebtoken");
let User = require("../models/user")

exports.createAccessToken = function (
    user,
    provider,
    callback,

    
) {
    delete 
    jwt.sign(
        { user: user._id },
        process.env.JWT_SECRET_KEY,
        function (err, tokenData) {
            if (err) {
                console.log(err)
                return callback(err);
            } else {
                User.findByIdAndUpdate(
                    user._id,
                    {
                        $set: {
                            access_token: {
                                token: tokenData,
                                token_type: "Bearer",
                                isUsed: false,
                            },
                            provider: provider,
                        },
                    },
                    { safe: true, new: true },
                    function (err, userModel) {
                        if (err) {
                            return callback(err);
                        } else {
                            return callback(null, userModel);
                        }
                    }
                );
            }
        }
    );
};
