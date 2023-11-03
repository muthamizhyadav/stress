var https = require('https');
var urlencode = require('urlencode');
const urlencodeed = require('rawurlencode');
const moment = require('moment');
const axios = require('axios');
const { generateToken_OTP } = require("./token.service")




const Otp = async (mobile, user) => {
    const contact = mobile;
    let OTPCODE = Math.floor(100000 + Math.random() * 900000);
    let message = `${OTPCODE} is the Onetime password(OTP) to reset the password. This is usable once and valid for 5 mins from the request. PLS DO NOT SHARE WITH ANYONE - AgriExpoLive2023(An Ookam company event)`;
    let reva = await axios.get(
        `http://panel.smsmessenger.in/api/mt/SendSMS?user=ookam&password=ookam&senderid=OOKAMM&channel=Trans&DCS=0&flashsms=0&number=${contact}&text=${message}&route=6&peid=1701168700339760716&DLTTemplateId=1707169089051541000`
    );

    return await saveOtp(contact, OTPCODE, user);

};

callback = function (response) {
    var str = '';
    response.on('data', function (chunk) {
        str += chunk;
    });
    response.on('end', function () {
        //console.log(str);
    });
};

const { OTP } = require('../models/userDetails.model');

const saveOtp = async (number, otp, user) => {

    const exp = moment().add(1, 'minutes');

    let otp_gen = await OTP.create({
        OTP: otp,
        mobileNumber: number,
        userId: user,
        create: moment(),
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HHmms'),
        expTime: exp
    });

    let token = await generateToken_OTP(user, otp_gen._id, exp, 'otp-verify')

    return { token: token }


};

module.exports = { Otp };
