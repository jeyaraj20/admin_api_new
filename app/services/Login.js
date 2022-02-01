"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose"); 
const moment = serviceLocator.get("moment"); 
const jwt = serviceLocator.get("jsonwebtoken"); 
const Admin = mongoose.model("tbl__admin");
const School = mongoose.model("tbl__school");
const Operator = mongoose.model("tbl__operator");
const SchoolOperator = mongoose.model("tbl__school_operator");
module.exports = {
    // 1.ValidateAdminLogin
    validateLogin: async(req, res, next) => {
        try {
            const { admin_name, admin_pass, type, logintype } = req.payload;
            const password = admin_pass//Buffer.from(admin_pass).toString("base64");
            if (type == "S" && logintype == "G") {
                let rows  = await Admin.find({
                        admin_name: admin_name,
                        admin_pass: password,
                        admin_status: 'Y'
                }).catch((err) => {
                    return jsend(400, "Please send valid request data");
                });
                
                if (rows && rows.length > 0) {
                    rows=rows[0]
                    const payload = {
                        user: {
                            id: 1,
                            name: rows.admin_name,
                            username: rows.admin_name,
                            userid: rows.admin_id,
                            type: type,
                            status: rows.admin_status,
                            logintype: logintype,
                            apiurl: "http://localhost:4002/api",
                            schoolid: 1,
                            schoolname: 'Question Cloud',
                            logo: 'questioncloud.png'
                        },
                    };
                    console.log(payload);
                    let token = jwt.sign(payload, "questionCloudSecret", {
                        expiresIn: "24h",
                    });
                    const userData = await Operator.find({
                        op_id: rows.op_id
                    });
                   const response = res.response({ token })
                       .header('x-auth-token', token)
                   return response
                } 
                else {
                    if (admin_name == ""){
                        return ({ message: "Please Give User ID" });
                    }
                    else if (admin_pass == ""){
                        return({ message: "Please Give password" });
                    }
                    else {
                    return jsend(404,{ message: "Please send valid data" });
                    }
                }
            }
            if (type == "S" && logintype == "I") {
                console.log("school");
                const rows  = await School.find({
                        emailId: admin_name,
                        password: password,
                        schoolStatus: 'Y'
                });
                if (rows && rows.length > 0) {
                    rows = rows[0]
                    const payload = {
                        user: {
                            id: rows.id,
                            name: rows.schoolName,
                            username: rows.emailId,
                            userid: rows.id,
                            type: type,
                            status: rows.schoolStatus,
                            logintype: logintype,
                            apiurl: "http://localhost:4002/api/school",
                            schoolid: rows.id,
                            schoolname: rows.schoolName,
                            logo: rows.schoolLogo
                        },
                    };
                    console.log(payload);
                    let token = jwt.sign(payload, "questionCloudSecret", {
                        expiresIn: "24h",
                    });
                    const response = res.response({ token })
                    .header('x-auth-token', token)
                return response
                } else {
                    if (admin_name == "")
                        return({ message: "Please Give User ID" });
                    else if (admin_pass == "")
                        return({ message: "Please Give password" });
                    else return({ message: "User not found" });
                }
            }
        } catch (error) {
            logger.error(`Error at Login Admin and School Login : ${error.message}`);
           return jsend(500, error.message)
        }
    },
    // 2. ValidateSchooolAdminLogin
    // validateAdminLogin: async(req, res, next) => {
    //     try {
    //         const { admin_name, admin_pass, type, logintype } = req.payload;
    //         const password = admin_pass//Buffer.from(admin_pass).toString("base64");
    //         if (type != "S" ) {
    //           console.log("ertyuik")
    //             let rows  = await Operator.find({
    //                     op_uname: admin_name,
    //                     op_password: password,
    //                     op_status: 'Y',
    //                     op_type: type
    //             });
    //             console.log(rows)
    //             if (rows && rows.length > 0) {
    //                 rows= rows[0]
    //                 const payload = {
    //                     user: {
    //                         id: 1,
    //                         name: rows.op_name,
    //                         username: rows.op_uname,
    //                         userid: rows.op_id,
    //                         type: type,
    //                         status: rows.op_status,
    //                         logintype: logintype,
    //                        apiurl: "http://localhost:4002/api",
    //                        schoolid: 1,
    //                         schoolname: 'Question Cloud',
    //                         logo: 'questioncloud.png'
    //                     },
    //                 };
                   
    //                 let token = jwt.sign(payload, "questionAdminSecret", {
    //                     expiresIn: "24h",
    //                 });
    //                 const response = res.response({ token })
    //                 .header('x-auth-token', token)
    //             return response
    //             } // Create Jwt Payload
    //             if(rows) {
    //                 if (admin_name == "")
    //                     return({ message: "Please Give User ID" });
    //                 else if (admin_pass == "")
    //                     return({ message: "Please Give password" });
    //                 else {
    //                     return({ message: "User not found" });
    //                 } 
    //             }
    //         }

    //         if (type != "S" && logintype == "I") {
    //             const rows  = await SchoolOperator.find({
    //                     op_uname: admin_name,
    //                     op_password: password,
    //                     op_status: 'Y',
    //                     op_type: type
                   
                 
    //             });
    //             if (rows && rows.length > 0) {
    //                 rows=rows[0]
    //                 console.log(rows.School);
    //                 const payload = new SchoolOperator({
    //                     user: {
    //                         id: rows.School.id,
    //                         name: rows.op_name,
    //                         username: rows.op_uname,
    //                         userid: rows.op_id,
    //                         type: type,
    //                         status: rows.op_status,
    //                         logintype: logintype,
    //                         apiurl: "http://localhost:4002/api/school",
    //                         schoolid: rows.School.id,
    //                         schoolname: rows.School.schoolName,
    //                         logo: rows.School.schoolLogo
    //                     }  
    //                });
    //                 payload.save()
    //                 console.log(payload);
    //                 let token = jwt.sign(payload, "questionAdminSecret", {
    //                     expiresIn: "24h",
    //                 });
    //                 const response = res.response({ token })
    //                         .header('x-auth-token', token)
    //                     return response
                   
    //             } // Create Jwt Payload
    //             else {
    //                 if (admin_name == "")
    //                     return({ message: "Please Give User ID"});
    //                 else if (admin_pass == "")
    //                     return({ message: "Please Give password" });
    //                 else return({ message: "User not found" });
    //             }
    //         }
    //     } catch (error) {
    //         logger.error(`Error at Admin and Faculty Validate Login : ${error.message}`);
    //         return jsend(500, error.message)
    //     }
    // },
  
};