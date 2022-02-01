//-------------------------- Category Model Start ------------------------------//
"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const ExamPackageDurationSchema = new mongoose.Schema({
  
            package_duration_id: {
                type: String,
                required: true,
                autoIncrement: true,
            },
            exam_package_ref_id: {
                type: String,
                required: true
            },
            duration_ref_id: {
                type: String,
                required: true
            },
            price: {
                type: String,
                required: true
            },                               
  }); 
  module.exports = mongoose.model("tbl__exampackage_duration",ExamPackageDurationSchema);

//-------------------------- Category Model End ------------------------------//
