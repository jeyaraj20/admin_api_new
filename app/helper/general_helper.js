const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const http = require("http");
const { Console } = require("console");
require("dotenv").config();

// SMTP Server Mail Config
const smtpConfig = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: process.env.emailUsername,
        pass: process.env.emailPassword,
    },
};

module.exports = {
    // Image Filter by type
    ImageFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            req.fileValidationError = "Only image files are allowed!";
            return cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
    },

    // Excel Filter by type
    ExcelFilter: function (req, file, cb) {
        // Accept Excel only
        if (!file.originalname.match(/\.(xls|xlsx|xlsm)$/)) {
            req.fileValidationError = "Only excel files are allowed!";
            return cb(new Error("Only excel files are allowed!"), false);
        }
        cb(null, true);
    },

    // Result Send Mail
    SendResultMail: async (toAddress, subject, userName, data, examname) => {
        try {
            let filePath = path.join(__dirname, "../emailtemplates/result.htm");
            fs.readFile(filePath, "utf8", async (err, resData) => {
                console.log("resData", resData, data);
                let content = resData.toString().replace("{{totalquest}}", data.totalQuestions);
                content = content.toString().replace("{{totalmarks}}", data.totalMarks);
                content = content.toString().replace("{{attempted_quest}}", data.questionsSeen);
                content = content.toString().replace("{{answerd}}", data.questionsAnswered);
                content = content.toString().replace("{{notanswerd}}", data.questionsNotAnswered);
                content = content.toString().replace("{{crtattend}}", data.noOfCorrectAnswer);
                content = content.toString().replace("{{wrongattend}}", data.noOfWrongAnswer);
                content = content.toString().replace("{{totpostmark}}", data.marksForCorrectAnswer);
                content = content.toString().replace("{{totnegmark}}", data.marksForWrongAnswer);
                content = content.toString().replace("{{obtainmark}}", data.finalScore);
                content = content.toString().replace("{{username}}", userName);
                content = content.toString().replace("{{examname}}", examname);

                var transporter = nodemailer.createTransport(smtpConfig);
                var mailOptions = {
                    from: "QUESTION CLOUD", // sender address
                    to: toAddress, // list of receivers
                    subject: subject, // Subject line
                    html: content, // You can choose to send an HTML body instead
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log("Message sent failed: " + error);
                        return false;
                    } else {
                        console.log("Message sent: " + info.response);
                        return true;
                    }
                });
            });
        } catch (err) {
            console.log(`Error while sent result via mail : ${err}`);
        }
    },

    // Result Send SMS
    SendResultSms: (mobileNo, user_name, obtainmark, exam_name) => {
        let sms_text = `Dear ${user_name}, You have scored ${obtainmark} Marks in the CBSE ${exam_name} @Question Cloud. Download Question Cloud Assessing App at https://play.google.com/store/apps/details?id=io.ionic.questioncloud`;
        //let smsApiUri = `http://bhashsms.com/api/sendmsg.php?user=questioncloud&pass=1234&sender=QNSCLD&phone=${mobileNo}&text=${sms_text}&priority=ndnd&stype=normal`;
        let smsApiUri = `http://fastsms.expressad.in/api/v1/send-sms?api-key=K2TyCySMXMrmlPxpluT5ndwSDc8ekEav4DYMvOdK&sender-id=QNSCLD&sms-type=1&route=1&mobile=${mobileNo}&message=${sms_text}`;
        http.get(smsApiUri, (resp) => {
            let data = "";
            // A chunk of data has been recieved.
            resp.on("data", (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on("end", () => {
                console.log(data);
            });
        }).on("error", (err) => {
            console.log("Result SMS Sent Error: " + err.message);
        });
    },

    // OTP Mail
    SendOtpMail: async (toAddress, subject, otpNo) => {
        try {
            var transporter = nodemailer.createTransport(smtpConfig);
            var mailOptions = {
                from: "QUESTION CLOUD", // sender address
                to: toAddress, // list of receivers
                subject: subject, // Subject line
                text: `${otpNo} is the OTP for your Question Cloud account`, // plaintext body
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("Message sent failed: " + error);
                    return false;
                } else {
                    console.log("Message sent: " + info.response);
                    return true;
                }
            });
        } catch (err) {
            console.log(`Error while sent otp via mail: ${err}`);
        }
    },

    // OTP SMS
    SendOtpSms: (mobileNo, otpNo,name) => {
        
        let sms_text = `Dear ${name}, Your OTP for the Question Cloud Account REGISTRATION is ${otpNo}. Download Question Cloud Assessing App at https://play.google.com/store/apps/details?id=io.ionic.questioncloud`;
        //let smsApiUri = `http://bhashsms.com/api/sendmsg.php?user=questioncloud&pass=1234&sender=QNSCLD&phone=${mobileNo}&text=${sms_text}&priority=ndnd&stype=normal`;
        let smsApiUri = `http://fastsms.expressad.in/api/v1/send-sms?api-key=K2TyCySMXMrmlPxpluT5ndwSDc8ekEav4DYMvOdK&sender-id=QNSCLD&sms-type=1&route=1&mobile=${mobileNo}&message=${sms_text}`;
        http.get(smsApiUri, (resp) => {
            let data = "";
            // A chunk of data has been recieved.
            resp.on("data", (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on("end", () => {
                console.log(data);
            });
        }).on("error", (err) => {
            console.log("OTP SMS Sent Error: " + err.message);
        });
    },

    // Forgot Password SMS
    SendForgotPasswordSms: (username, password, mobileNo) => {
        let sms_text = `Hi ${username}, ${password} is your password for Question Cloud account.`;
        //let smsApiUri = `http://bhashsms.com/api/sendmsg.php?user=questioncloud&pass=1234&sender=QNSCLD&phone=${mobileNo}&text=${sms_text}&priority=ndnd&stype=normal`;
        let smsApiUri = `http://fastsms.expressad.in/api/v1/send-sms?api-key=K2TyCySMXMrmlPxpluT5ndwSDc8ekEav4DYMvOdK&sender-id=QNSCLD&sms-type=1&route=1&mobile=${mobileNo}&message=${sms_text}`;
        console.log(smsApiUri);
        http.get(smsApiUri, (resp) => {
            let data = "";
            // A chunk of data has been recieved.
            resp.on("data", (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on("end", () => {
                console.log(data);
            });
        }).on("error", (err) => {
            console.log("Forgot Password SMS Sent Error: " + err.message);
        });
    },

    // Send Password Mail
    SendPasswordMail: async (toAddress, subject, password) => {
        try {
            var transporter = nodemailer.createTransport(smtpConfig);
            var mailOptions = {
                from: process.env.emailUsername, // sender address
                to: toAddress, // list of receivers
                subject: subject, // Subject line
                html: `<p>${password} is your password for Question Cloud account.<p>`, // plaintext body
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("Message sent failed: " + error);
                    return false;
                } else {
                    console.log("Message sent: " + info.response);
                    return true;
                }
            });
        } catch (err) {
            console.log(`Error while sent password via mail: ${err}`);
        }
    },

    SendContactUsMail: async (sendermail, sendername, sendermobile, mailid, subject, message) => {
        try {
            var transporter = nodemailer.createTransport(smtpConfig);
            var mailOptions = {
                from: sendermail, // sender address
                to: "questioncloud1@gmail.com", // list of receivers
                subject: subject, // Subject line
                text: `Sender: ${sendername}, Sender Mobile: ${sendermobile}, Mail: ${mailid} Message: ${message}. `, // plaintext body
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("Message sent failed: " + error);
                    return false;
                } else {
                    console.log("Message sent: " + info.response);
                    return true;
                }
            });
        } catch (err) {
            console.log(`Error while sent password via mail: ${err}`);
        }
    },
};
