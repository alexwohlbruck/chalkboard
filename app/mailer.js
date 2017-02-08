// Email module
// Docs -- https://nodemailer.com/

// Convert this into a reusable services
// Service will take a template name and data to go with it, perhaps pass in the 'req' object
// Have an email templates folder where different types of email can be placed
// They will consist of html with injectable data
// Inject data using 'require()', passing a data object
// Use data object in template by concatenating stringed html with values
// 'module.exports = ' back to this file for the email to be compiled and sent

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'chalkboard.login@gmail.com',
        pass: 'easypassword'
    }
});

// Basing mail sending functionality
/*transporter.sendMail({
    from: 'chalkboard.login@gmail.com',
    to: 'alexwohlbruck@gmail.com',
    subject: 'Test email',
    text: 'This email was sent to your inbox from a node.js server using Nodemailer'
}, function(err, response) {
    if (err) console.log(err);
    console.log(response);
    transporter.close();
});*/