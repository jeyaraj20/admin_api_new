//-------------------------- Exam Chapters Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const ExamChaptersSchema = new mongoose.Schema({
  
      
            chapt_id: {
                type: String,
                required: true,
                autoIncrement: true,
            },
            exa_cat_id: {
                type: String,
                required: true
            },
            exmain_cat: {
                type: String,
                required: true
            },
            exsub_cat: {
                type: String,
                required: true
            },
            chapter_name: {
                type: String,
                required: true
            },
            chapter_date: {
                type: String,
                required: true
            },
            chapter_status: {
                type: String,
                required: true
            },
            lastupdate: {
                type: Date,
                default: Date.now
            },
            paymentFlag: {
               type: String,
                required: true
            },
                                                 
  }); 
  module.exports = mongoose.model("tbl__examchapters",ExamChaptersSchema);

      
//-------------------------- Exam Chapters Model End ------------------------------//
