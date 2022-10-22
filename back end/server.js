const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const app = express();
require("dotenv-flow").config();

//Db connections chnages
require("./database");
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.use(
  session({
    secret: "authorize",
    key: "authorize",
    saveUninitialized: true,
    resave: false,
    cookie: { secure: false },
  })
);


// Passport init
app.use(passport.initialize());
app.use(passport.session());

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


require("./routes/index")(app);

app.use((req, res, next) => {
  throw new Error("No route found or internal error");
});

app.use(function (error, req, res, next) {
  if (res.headerSent) {
    return next(error);
  }
 return res.status(error.code || 500).json({
    status: error.status || "error",
    statusCode: error.code || 500,
    message: error.message || "An unknown error has occurred",
    data: error.data || {}, 
  });
});

app.listen(process.env.PORT || 8080, function () {
  console.log("Server listening on port ", 8080);
});

