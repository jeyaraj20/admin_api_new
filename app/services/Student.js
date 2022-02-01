"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose");
const moment = serviceLocator.get("moment");
const Student = mongoose.model("tbl__student");

module.exports = {
    // 1. Get All Active Student
    getAllStudent: async (req, res, next) => {
        try {
            const { stud_status } = req.params;
            if (stud_status == 0) return jsend(400, "Please send valid request data");
            const rows = await Student.find({
                stud_status: stud_status
            }).sort({ stud_regno: 1 });
            if (!rows) {
                return jsend(404, "Student Not Found !!!");
            } else {
                const count = rows.length;
                return jsend(200, "data received Successfully",
                    { count, Student: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Active Student : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 2. Get Student By Id
    getStudentById: async (req, res, next) => {
        try {
            const { stud_id } = req.params;
            if (stud_id == 0) return jsend(400, "Please send valid request data");
            const Students = await Student.findOne({
                stud_id: stud_id
            });
            if (!Students) {
                return jsend(404, "Student Not Found !!!");
            } else {
                return jsend(200, "data received Successfully",
                    { Students });
            }
        } catch (error) {
            logger.error(`Error at Get Student By Id : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 3. Create Student
    createStudent: async (req, res, next) => {
        try {
            const {
             stud_fname, stud_lname,stud_regno,stud_email,stud_mobile, stud_gender,ipaddress,} = req.payload;
     if (  !stud_fname || !stud_lname || !stud_regno || !stud_email || !stud_mobile ||!stud_gender || !ipaddress
            )
                return jsend(400, "Please send valid request data");
                const stud_id = await Student.find({}).sort({ $natural: -1 }).limit(1)
              const result= await Student.create(
                    {
                        stud_id: (stud_id && stud_id.length>0) ? Number(stud_id[0].stud_id) + 1 : 1,
                        stud_fname,
                        stud_lname,
                        stud_dob: moment(Date.now()).format("YYYY-MM-DD"),
                        stud_regno,
                        stud_email,
                        stud_mobile,
                        mob_otp: "",
                        otp_status: "N",
                        stud_image: "",
                        stud_gender,
                        stud_pass: "",
                        edu_qual: "",
                        med_opt: "",
                        country_id: "",
                        state_id: "",
                        city_id: "",
                        parent_name: "",
                        state: "",
                        district: "",
                        location: "",
                        address: "",
                        pincode: "",
                        parent_relation: "",
                        parent_mobile: "",
                        stud_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        stud_status: "Y",
                        ipaddress,
                        lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    },
                ).catch((err) => {
                        return jsend(404,err.message);
                    });
                    if(result){
                        return jsend(200, "data received Successfully",
                        { message: "Create Success" })
                    }else{
                        return jsend(500, "Please try again after sometime")
                    }
        } catch (error) {
            logger.error(`Error at Create Student : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 4. Update Student By Id
    updateStudentById: async (req, res, next) => {
        try {
            const { stud_id } = req.params;
      
      const {stud_fname, stud_lname, stud_regno, stud_email, stud_mobile,
                stud_gender, ipaddress, } = req.payload;
        if (
          !stud_fname ||!stud_lname || !stud_regno || !stud_email ||
                !stud_mobile ||!stud_gender || !ipaddress )
                return jsend(400, "Please send valid request data");
            const result = await Student.findOneAndUpdate(
                { stud_id: stud_id },
                {
                    stud_fname,
                    stud_lname,
                    stud_dob: moment(Date.now()).format("YYYY-MM-DD"),
                    stud_regno,
                    stud_email,
                    stud_mobile,
                    mob_otp: "",
                    otp_status: "N",
                    stud_image: "",
                    stud_gender,
                    stud_pass: "",
                    edu_qual: "",
                    med_opt: "",
                    country_id: "",
                    state_id: "",
                    city_id: "",
                    parent_name: "",
                    state: "",
                    district: "",
                    location: "",
                    address: "",
                    pincode: "",
                    parent_relation: "",
                    parent_mobile: "",
                    stud_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    stud_status: "Y",
                    ipaddress,
                    lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                }
            ).catch((err) => {
                return jsend(404, err.message);
            });
            if (result) {
                return jsend(200, "data received Successfully",
                    { message: "Update Success" })
            } else {
                return jsend(500, "Please try again after sometime")
            }
        } catch (error) {
            logger.error(`Error at Update Student : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 5. Update 'Inactive / Active / Delete'
    updateStatusById: async (req, res, next) => {
        try {
            const { stud_id, status } = req.payload;
            if (!stud_id || !status) return jsend(400, "Please send valid request data");
              const result=  await Student.findOneAndUpdate(
                    { stud_id: stud_id },
                    { stud_status: status }                      
                ) .catch((err) => {
                    return jsend(404, err.message);
                });
                    if(result){
                        return jsend(200, "data received Successfully",
                            { message: "Updated Success" })
                    }else{
                        return jsend(500, "Please try again after sometime")
                    }
        } catch (error) {
            logger.error(`Error at Update Student Status : ${error.message}`);
            return jsend(500,error.message);
        }
    },
    // 6. Get Students Count Only
    getStudentsCount: async (req, res, next) => {
        try {
            const { stud_status } = req.params;
            if (stud_status == null) return jsend(400, "Please send valid request data");
            const count = await Student.count({
                stud_status: stud_status,
            }).catch((err) => {
                return jsend(500, err.message);
            });
            return jsend(200, "data received Successfully", { count });
        } catch (error) {
            logger.error(`Error at Get Students Count Only : ${error.message}`);
            return jsend(500, error.message);
        }
    },

};
