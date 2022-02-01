//-------------------------- Exam Types Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const ExamTypesSchema = new mongoose.Schema({
  
            extype_id: {
                type: String,
                required: false
            },
            exa_cat_id: {
                type: String,
                required: false
            },
            exmain_cat: {
                type: String,
                required: false
            },
            exsub_cat: {
                type: String,
                required: false
            },
            extest_type: {
                type: String,
                required: false
            },
            extype_date: {
                type: Date,
                default: Date.now
            },
            extype_status: {
                type: String,
                required: false
            },
            lastupdate: {
                type: Date,
                default: Date.now
            },
                                                           
  }); 
  module.exports = mongoose.model("tbl__examtypes",ExamTypesSchema);

    

//-------------------------- Exam Types Model End ------------------------------//
