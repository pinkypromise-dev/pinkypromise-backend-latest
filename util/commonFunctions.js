const JWT = require('jsonwebtoken');
const { responseMessageCode } = require('./constants');
const logger = require('./logger');
const nodemailer = require('nodemailer');
const Nexmo = require('nexmo')

const nexmo = new Nexmo({
    apiKey: "c4ebb8c6",
    apiSecret: "CiVLM9boPvVQGpLH"
})
const generateJWToken = (payload) => {
    try {
        const secret = 'secret_key'
        const signOptions = {
            issuer: 'tracking',
            expiresIn: '30d'
        };
        payload.creationDateTime = Date.now();
        const token = JWT.sign(payload, secret, signOptions);
        return (token);
    } catch (error) {
        return (error);
    }
};

const validateAccessToken = (token) => {
    return new Promise((resolve, reject) => {
        const secret = 'secret_key'

        const verifyOptions = {
            issuer: 'tracking',
            expiresIn: '30d'
        };
        JWT.verify(token, secret, verifyOptions, (err, decoded) => {
            if (err) {
                logger.error(err.toString());

                reject(responseMessageCode.INVALID_ACCESS_TOKEN);
            }

            resolve(decoded);
        });
    });
};



const validateUser = (opts) => {
    return new Promise((resolve, reject) => {
        const user = opts.user;
        if (!user) {
            reject(responseMessageCode.NO_DATA_FOUND);
        }
        resolve(200);
    });
};

const generatepassword = () => {
    var generator = require('generate-password');
    var password = generator.generate({
        length: 10,
        numbers: true
    })
    return password
}

const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);

};



function sendOtpNexmo(otpDetails) {
    const TwoFactor = new (require('2factor'))('b6d71c4f-58b1-11eb-8153-0200cd936042') //3795902e-2c0c-11eb-83d4-0200cd936042
    TwoFactor.sendOTP(otpDetails.to, { otp: otpDetails.text }).then((sessionId) => {
        console.log("Message sent successfully.", sessionId)
    }, (error) => {
        console.log('Message failed with error:' + error)
    })
    // const TwoFactor = new (require('2factor'))('b6d71c4f-58b1-11eb-8153-0200cd936042') //3795902e-2c0c-11eb-83d4-0200cd936042
    // TwoFactor.sendOTP("8150951352", { otp: "123456" }).then((sessionId) => {
    //     console.log("Message sent successfully.", sessionId)
    // }, (error) => {
    //     console.log('Message failed with error:' + error)
    // })
}

function sendEmailNodemailer(mailOptions) {
    let user = "pinkypromisedev@gmail.com";
    let pass = "pinkypromise123@"
    var transporter = nodemailer.createTransport('smtps://' + user + ':' + pass + '@smtp.gmail.com');

    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log({
                success: 0,
                msg: 'email error',
                data: error.message
            });
        } else {
            console.log({
                success: 1,
                msg: 'mail send successfully',
                data: response
            });
        }
    });
}

module.exports = {
    generateJWToken,
    validateAccessToken,
    validateUser,
    generateOTP,
    sendOtpNexmo,
    sendEmailNodemailer,
    generatepassword
};
