const nodemailer = require("nodemailer");

const hbs = require("nodemailer-express-handlebars");

const path = require("path");

const options = require("./cred");

class SendGmail {
  async sendMail(email) {
    try {
      const accessToken = await options.auth2client.getAccessToken();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "fizzbiznet@gmail.com",
          clientId: options.CLIENTID,
          clientSecret: options.CLIENTSECRETE,
          refreshToken: options.REFRESHTOKEN,
          accessToken: accessToken,
        },
      });

      transporter.use(
        "compile",
        hbs({
          viewPath: path.join(__dirname, "/views"),
          extName: ".hbs",
          defaultLayout: "layout",
          layoutsDir: path.join(__dirname, "/views/layouts/"),
        })
      );

      const result = await transporter.sendMail(email);

      return result;
    } catch (error) {
      return error;
    }
  }
}

module.exports = SendGmail;
