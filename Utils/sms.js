exports.generateSmsCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
};


const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

exports.sendSms = async (to, message) => {
  await client.messages.create({
    body: message,
    from: fromNumber,
    to
  });
};

