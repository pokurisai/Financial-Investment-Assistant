const fs = require("fs");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const path = require("path");
exports.sendEmail = function (userDetails, getPath, cb) {
  var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    auth: {
      user: "pokurisai123@outlook.com",
      pass: "8328365637sS",
    },
    secureConnection: false,
    tls: { ciphers: 'SSLv3' }
  });
  
  //readint the email
  // "../templates/signup.html"
  var getPath = path.join(__dirname, getPath);
  fs.readFile(getPath, "utf8", function read(err, data) {
    if (err) {
      console.log(err);
      cb(err);
    } else {
      var template = handlebars.compile(data);
      var replacements = userDetails;

      var file = template(replacements);

      var mailOptions = {
        from: "<pokurisai123@outlook.com>", // sender address
        to: userDetails.email, // list of receivers
        subject: userDetails.subject, // Subject line
        html: file,
        // attachments: [path]
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          cb(error);
        } else {
          cb(null, "Success");
        }
      });
    }
  });
};
