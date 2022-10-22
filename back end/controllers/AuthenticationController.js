const passport = require("passport"),
  BearerStrategy = require("passport-http-bearer").Strategy,
  LocalStrategy = require("passport-local").Strategy,
  jwtToken = require("jsonwebtoken"),
  JWT = require("../middleware/jwt");
const User = require("../models/user")

passport.use(
  new LocalStrategy(
    {
      usernameField: "account",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, account, password, done) {
      User.findOne({email : account},
        function (err, user) {
          if (err) throw err;
          if (!user) {
            return done({
              status : "Error",
              statusCode: 401,
              message: "Invalid account/password",
              data : {}
            });
          } else {
            User.comparePassword(
              password,
              user.password,
              function (err, isMatch) {
                if (err) {
                  return done({
                    status : "Error",
                    statusCode: 401,
                    message: err.message,
                    data : {}
                  });
                }
                if (isMatch) {
                  JWT.createAccessToken(
                    user,
                    "local",
                    function (err, result) {
                      if (err) {
                          console.log(err)
                      } else {
                        done(null, result);
                      }
                    },
                  );
                } else {
                  return done({
                    statusCode: 401,
                    message: "Invalid account/password",
                  });
                }
              }
            );
          }
        },
      );
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (req, id, done) {
  User.getUserById(id, function(err, user){
    done(err, user)
  })
});

passport.use(
  new BearerStrategy({ passReqToCallback: true }, function (
    req,
    accessToken,
    callback
  ) {
    jwtToken.verify(
      accessToken,
      process.env.JWT_SECRET_KEY,
      function (err, token) {
        if (err) {
          return callback(null, false);
        }
        if (!token) {
          return callback(null, false);
        }
        User.findOne(
          {
            _id: token.user,
          },
          function (err, user) {
            if (err) {
              return callback(null, false);
            }
            // No user found
            if (!user) {
              return callback(null, false);
            }
            return callback(null, user, {
              scope: "*",
            });
          }
        );
      }
    );
  })
);

exports.isLocalAuthenticated = passport.authenticate("local");
exports.isBearerAuthenticated = passport.authenticate("bearer", {
  session: true,
});
