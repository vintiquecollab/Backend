const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function main(method, user) {
  const token = jwt.sign({ email: user.email }, process.env.TOKEN_KEY);
  let subject = "Verify your email";
  let html = "";
  if (method == "register") {
    subject = "Verify your email";
    html = `<div style='height: 150px; width: 100%;'>
              <h3>Hi dear ${user.first_name},</h3>
              <p>
                <div>
                  welcome to <span style='font-weight: bold;'>PackPal</span>,
                  Click the button bellow to Verify your email
                  <br>
                  <a href="http://localhost:${process.env.PORT}/api/auth/verify-email/${token}" style="background-color: #0072bb; border: none; color: white; padding: 10px 15px; margin-top: 10px; border-radius: 6px; text-align: center; text-decoration: none;display: inline-block;">
                    Verify
                  </a>
                </div>
              </p>
            </div>`;
  }
    if (method == "forgotPassword") {
      subject = "Forget password";
      html = `<div style='height: 150px; width: 100%;'>
                <h3>Hi dear ${user.first_name}</h3>
                <p>
                  <div>
                    welcome to <span style='font-weight: bold;'>PackPal</span>,
                    Click the button bellow to reset your password
                    <br>
                    <a href="http://localhost:${process.env.PORT}/api/auth/verify-forgot-password/${token}" style="background-color: #0072bb; border: none; color: white; padding: 10px 15px; margin-top: 10px; border-radius: 6px; text-align: center; text-decoration: none;display: inline-block;">
                      Log here
                    </a>
                  </div>
                </p>
              </div>`;
    }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"PackPal👻" <${process.env.EMAIL}>`, // sender address
    to: user.email, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  // verify connection configuration
  //   transporter.verify(function (error, success) {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log("Server is ready to take our messages");
  //     }
  //   });
}

module.exports = {
  main,
};
