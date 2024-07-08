const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const sendVerificationEmail = async (userEmail, otp, username) => {
  const myEmail = process.env.EMAIL_ID;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUrl = process.env.REDIRECT_URL;
  const refreshToken = process.env.REFRESH_TOKEN;

  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUrl
  );
  oAuth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: myEmail,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "Todo App <" + myEmail + ">",
      to: userEmail,
      subject: `${otp} is your Todo App ${
        username ? "account verification code" : "account recovery code"
      }`,

      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #f4f4f4;
                    border: 1px solid #ddd;
                }
                .header {
                    background-color: #111827;
                    color: #fff;
                    text-align: center;
                    padding: 10px 0;
                }
                .header img {
                    width: 50px;
                    height: auto;
                    vertical-align: middle;
                }
                .header h1 {
                    display: inline-block;
                    margin: 10px;
                    font-size: 28px;
                    vertical-align: middle;
                }
                .content {
                    padding: 20px;
                    text-align: left;
                }
                .content p {
                    margin: 0 0 20px 0;
                    text-align: left;
                }
                .footer {
                    border-top: 2px solid #ddd;
                    padding-top: 20px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://drive.google.com/uc?export=view&id=18ywIIN7sCMiwfnt1PtbUP5N9KmOzWmsn" alt="Todo App" class="logo">
                    <h1>Todo App</h1>
                </div>
                <div class="content">
                    <p>Dear ${username || "User"},</p>
                    <p>We received your request for a single-use code to use with your Todo App account.</p>
                    <p>Please use the following OTP ${
                      username
                        ? "to verify your account"
                        : "to Reset your password"
                    }:</p>
                    <div style="margin-bottom: 40px; text-align: center;">
                        <h2 style="font-size: 36px; margin: 0;">${otp}</h2>
                    </div>
                    <p>If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
                </div>
                <div class="footer">
                    <p>Thank you,<br />Todo App Team</p>
                </div>
            </div>
        </body>
        </html>

      `,
    };

    await transport.sendMail(mailOptions);
    console.log("Email with OTP sent successfully:");
  } catch (error) {
    throw new Error("Error sending email with OTP");
  }
};

module.exports = { sendVerificationEmail };
