const auth = require('../../config/keys/gmail.js');
const nodemailer = require('nodemailer');
const validator = require('validator');

const contact = ({ name, to, html }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth
  });

  const mailOptions = {
      to,
      html,
      from: 'david@venueiq.co',
      subject: `Hi ${name}! Here's your Venue IQ password.`
  };

  return new Promise((resolve, reject) => {
    if (!validator.isEmail(to)) {
      reject({ err: 'Invalid email address' });
    } else {
      transporter.sendMail(mailOptions, (err, response) => {
        console.log(err, response);
        if (err) {
          console.log(err);
          reject({ err });
        } else {
          resolve({ response, success: true });
        }
      });
    }
  });
};

export default contact;
