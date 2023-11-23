// const emailjs = require('@emailjs/nodejs');
const otpGenerator = require('otp-generator');

// // const emailService = {
// //   sendVerificationEmail: async (email) => {
// //     console.log('Sending verification email..');

// //     const publicKey = 'TeVUur3P7n0XBkv-s'; 

// //     emailjs.init(publicKey);

// //     emailjs.send("service_0iiok9p", "template_baj6cld", {
// //       from_name: "Mits",
// //       to_name: 'New User',
// //       message: otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false }),
// //       reply_to: email,
// //     },

// //     {
// //       publicKey,

// //     })
// //       .then((result) => {
// //         console.log(result.text);
// //       })
// //       .catch((err) => {
// //         console.log(err);
// //       });
// //   },
// // };

// const emailService = {
//   sendVerificationEmail: async (email) => {
//     console.log('Sending verification email..');
//     const data = {
//       service_id: 'service_0iiok9p',
//       template_id: 'template_baj6cld',
//       user_id: 'TeVUur3P7n0XBkv-s',
//       template_params: {
//         from_name: "Mits",
//         to_name: 'New User',
//         message: otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false }),
//         reply_to: email,
//       },
//     }
//     const response = await fetch('https://api.emailjs.com/api/v1.0/email/send',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//       }
//     )
//     console.log(response)
//   }
// }
// module.exports = emailService;


const nodemailer = require('nodemailer');

const emailService = {
  sendVerificationEmail: async (email, otp) => {
    console.log('Sending verification email..');
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'mitanshuagrawal5@gmail.com',
        pass: 'bmvgvzycgbdbkerj'
      }
    });
    
    console.log(email, otp);

    const mailOptions = {
      from: 'mitanshuagrawal5@gmail.com',
      to: email,
      subject: 'Email Verification',
      html: `<p>Hello, please verify your email to complete the registration process.</p><p>Your OTP is: ${otp}</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending verification email:', error);
      } else {
        console.log('Verification email sent:', mailOptions);
        console.log('Verification email sent:', info.response);
      }
    });
  }
} 

module.exports = emailService;