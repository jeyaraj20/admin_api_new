//-------------------------- Student Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const StudentSchema = new mongoose.Schema({


    stud_id: {
        type: String,
        required: false
    },
    stud_fname: {
        type: String,
        required: false
    },
    stud_lname: {
        type: String,
        required: false
    },
    stud_dob: {
        type: String,
        required: false
    },
    stud_regno: {
        type: String,
        required: false
    },
    stud_email: {
        type: String,
        required: false
    },
    stud_mobile: {
        type: String,
        required: false
    },
    mob_otp: {
        type: String,
        required: false
    },
    otp_status: {
        type: String,
        required: false
    },
    stud_image: {
        type: String,
        required: false
    },
    stud_gender: {
        type: String,
        required: false
    },
    stud_pass: {
        type: String,
        required: false
    },
    edu_qual: {
        type: String,
        required: false
    },
    med_opt: {
        type: String,
        required: false
    },
    country_id: {
        type: String,
        required: false
    },
    state_id: {
        type: String,
        required: false
    },
    city_id: {
        type: String,
        required: false
    },
    parent_name: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    district: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    pincode: {
        type: String,
        required: false
    },
    parent_relation: {
        type: String,
        required: false
    },
    parent_mobile: {
        type: String,
        required: false
    },
    stud_date: {
        type: Date,
        default: Date.now
    },
    stud_status: {
        type: String,
        required: false
    },
    ipaddress: {
        type: String,
        required: false
    },
    lastupdate: {
        type: Date,
        default: Date.now
    },

});
module.exports = mongoose.model("tbl__student", StudentSchema);

//-------------------------- Student Model End ------------------------------//
