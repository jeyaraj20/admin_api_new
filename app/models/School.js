//-------------------------- School Model Start ------------------------------//
"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const SchoolSchema = new mongoose.Schema({
  
    
            id: {
                type: String,
                required: true,
                autoIncrement: true,
            },
            schoolName: {
                type: String,
                required: true
            },
            schoolLogo: {
                type: String,
                required: true
            },
            address1: {
                type: String,
                required: true
            },
            address2: {
                type: String,
                required: true
            },
            phoneNumber: {
                type: String,
                required: true
            },
            emailId: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            contactPerson: {
                type: String,
                required: true
            },
            mobileNumber: {
                type: String,
                required: true
            },
            totalStudents: {
                type: String,
                required: true
            },
            schoolStatus: {
                type: String,
                required: true
            },
            ipAddress: {
                type: String,
                required: true
            },
            createdBy: {
                type: String,
                required: true
            },
            createdTimestamp: {
                type: Date,
                default: null
            },
            updatedBy: {
                type: String,
                required: true
            },
            updatedTimestamp: {
                type: Date,
                default: Date.now
            },
            expiryDate: {
                type: Date,
                default: Date.now
            },
                                                   
  }); 
  module.exports = mongoose.model("tbl__school",SchoolSchema);

            

//-------------------------- School Model End ------------------------------//
