"use strict";

const serviceLocator = require("../lib/service_locator");
const config = require("../configs/configs")();
const log = serviceLocator.get("logger");
const nodemailer = serviceLocator.get("nodemailer");
const path = serviceLocator.get("path");
const handlebars = serviceLocator.get("handlebars");
const _ = serviceLocator.get("_");
const htmlToText = serviceLocator.get("htmlToText");
const fs = serviceLocator.get("fs");
const util = serviceLocator.get("util");

const readFile = util.promisify(fs.readFile);
const templates = path.resolve(__dirname, "..", "email");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email.username,
    pass: config.email.password,
  },
});

class NodeMailerService {
  constructor() {}

  async prepareTemplate(filename, data) {
    try {
      const templatePath = path.resolve(templates, `${filename}.html`);

      const content = await readFile(templatePath, "utf8");

      const template = handlebars.compile(content);

      let context = {};

      _.each(Object.keys(data), (key) => {
        context[key] = data[key];
      });

      const html = template(context);

      const text = htmlToText.fromString(html);

      return {
        html,
        text,
      };
    } catch (error) {
      log.error(error);
      log.error("Cannot read the email template content.");
      throw new Error("Cannot read the email template content.");
    }
  }

  async sendMail(to, subject, variables, pathToTemplate) {
    const { html, text } = await this.prepareTemplate(
      pathToTemplate,
      variables
    );
    var mailOptions = {
      from: "rohini@vknowlabs.com",
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    try {
      transporter.sendMail(mailOptions);
      return "mail send";
    } catch (err) {
      log.error(err);
      throw err;
    }
  }
}

module.exports = NodeMailerService;
