//-------------------------- ExamSectionDetails Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const ExamSectionDetailsSchema = new mongoose.Schema({
  
      
            sect_id: {
                type: String,
                required: false,
            },
            exam_id: {
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
            menu_title: {
                type: String,
                required: false
            },
            no_ofquest: {
                type: String,
                required: false,
            },
            mark_perquest: {
                type: String,
                required: false
            },
            tot_marks: {
                type: String,
                required: false
            },
            neg_mark: {
                type: String,
                required: false
            },
            cut_off: {
                type: String,
                required: false
            },
            sect_time: {
                type: String,
                required: false
            },
            sect_date: {
                type: String,
                required: false
            },
            lastupdate: {
                type: Date,
                default: Date.now
            },
                                                  
  }); 
  module.exports = mongoose.model("tbl__exam_sectdetails",ExamSectionDetailsSchema);



//-------------------------- ExamSectionDetails Model End ------------------------------//
