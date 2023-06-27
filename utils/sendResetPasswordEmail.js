const { NODEMAILER_FROM } = require("../config/config");
const sendEmail = require("./sendEmail");

const mail = {
  from: NODEMAILER_FROM,
  subject: "Reset Password",
};

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;
  mail.to = email;
  mail.html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
  
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
            "Helvetica Neue", sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          line-height: 1.5;
        }
  
        main {
          width: 100%;
          margin: 50px auto;
          max-width: 600px;
          background-color: aqua;
          padding: 30px 40px;
          background-color: rgb(246, 246, 246);
        }
  
        .image-container {
          width: 100px;
          margin: 10px auto 40px;
        }
  
        .image-container img {
          width: 100%;
        }
  
        .content-container {
          background-color: #fff;
          padding: 50px 30px 40px 30px;
        }
  
        .content-container .heading-1 {
          font-size: 28px;
          margin-bottom: 10px;
          color: #5f4836;
        }
  
        .content-container .heading-2 {
          font-size: 20x;
          margin-bottom: 10px;
          color: #5f4836;
        }
  
        .content-container p {
          font-size: 16px;
          margin-bottom: 30px;
          color: #181818;
        }
  
        .content-container a {
          text-decoration: none;
          color: #fff;
        }
  
        .content-container a button {
          border: none;
          outline: none;
          padding: 10px 20px;
          border-radius: 5px;
          background-color: #ad8769;
          color: #fff;
          cursor: pointer;
          display: inline-block;
          font-weight: bold;
          font-size: 16px;
          transition: all 0.3s ease-in-out;
        }
  
        .content-container a button:hover {
          background-color: #775942;
        }
  
        @media screen and (max-width: 480px) {
          main {
            padding: 30px 20px;
          }
  
          .content-container .heading-1 {
            font-size: 22px;
            margin-bottom: 8px;
          }
        }
      </style>
    </head>
    <body>
      <main>
        <div class="image-container">
          <img
            src="https://res.cloudinary.com/dapwu9k1x/image/upload/v1687829041/logo_sljrbh.png"
            alt=""
          />
        </div>
        <div class="content-container">
          <h3 class="heading-1">We received a request to reset your password.</h3>
          <p class="paragraph">
            Protecting your data is important to us. <br />
            Please click on the button below to begin.
          </p>
          <div>
            <a href="${resetURL}">
              <button>Reset Password</button>
            </a>
          </div>
        </div>
      </main>
    </body>
  </html>
  `;
  return sendEmail(mail);
};

module.exports = sendResetPasswordEmail;
