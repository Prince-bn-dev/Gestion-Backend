const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "8275f4001@smtp-brevo.com",
    pass: "a4HfWh9K5btjTdBs",
  },
});

async function sendMail(receiver, title, content) {
  const info = await transporter.sendMail({
    from: '"AutoTrack" <princedossou465@gmail.com>',
    to: receiver,
    subject: title,
    text: content,
    html: content,
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = {
  sendMail,
};