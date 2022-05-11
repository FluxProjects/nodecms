const nodemailer = require('nodemailer');
const saltRounds = 10;
const accessTokenSecret = "F2A46A9101D3B65C419C98A9FFE73C154196BC3E87379491746CF5A70EE0B5E4D308B27B28F77960582D8FF88AB7C3C4930860436BF05D6D5517C8E3F9EFB8E5";
const refreshTokenSecret = 'b0b105135622e670639a01f44dc60a70f9ea7569dcfb591ff474ea17699693dfee9368a58448c75ae31f29f44414a4805e843ff9f37903f56fb67ab47af01872';

let smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "asadsaleem@gmail.com",
        pass: "Ahsan1234"
    },
    tls:{
        rejectUnauthorized: false
    }
});

module.exports={
    saltRounds:saltRounds,
    accessTokenSecret:accessTokenSecret,
    refreshTokenSecret:refreshTokenSecret,
    smtpTransport:smtpTransport
}