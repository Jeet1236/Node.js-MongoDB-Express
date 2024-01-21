const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1) create a transporter
  const transporter = nodemailer.createTransport({
    port: process.env.YOUR_PORT,
    host: process.env.YOUR_HOST,
    auth: {
      user: process.env.YOUR_USERNAME,
      pass: process.env.YOUR_PASSWORD,
    },
    // Activate in gmail less secure app option
  });
  //2) Define the email options
  const mailOptions = {
    from: 'Jeet Patel <hollajeet@55.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
