//-------------------------- Category Model Start ------------------------------//


"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const ExamPackageSchema = new mongoose.Schema({
  
      
            package_id: {
                type: String,
                required: false
            },
            package_name: {
                type: String,
                required: false
            },
            master_cat: {
                type: String,
                required: false
            },
            main_cat: {
                type: String,
                required: false
            },
            sub_cat: {
                type: String,
                required: false
            },
            chapt_id: {
                type: String,
                required: false
            },
            selling_price: {
                type: String,
                required: false
            },
            package_status: {
                type: String,
                required: false
            },
            package_date: {
                type: Date,
                default: Date.now
            },
            package_lastupdate: {
                type: Date,
                default: Date.now
            },
                                                    
  }); 
  module.exports = mongoose.model("tbl__exampackage",ExamPackageSchema);


//-------------------------- Category Model End ------------------------------//
