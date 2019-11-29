var express = require('express');
var router = express.Router();
nodemailer = require("nodemailer");


router.get('/', function(req, res, next) {
  res.render('about');
});

router.post('/', function(req, res, next) {

    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: 'gmail',
        auth: {
        user:  process.env.EMAIL_SENT_FROM,
        pass:  process.env.EMAIL_SENT_FROM_PASS
      }
    });

    var mailOptions = {
        from: process.env.EMAIL_SENT_FROM,
        to: process.env.EMAIL_SENT_TO,
        subject: 'email from ' + name + " " + email,
        text: message
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    res.render('about', {title:'Success', name: name, em:email, msg:message })

});
module.exports = router;