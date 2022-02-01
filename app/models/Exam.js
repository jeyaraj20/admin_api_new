//-------------------------- Exams Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const ExamsSchema = new mongoose.Schema({
  
    
            exam_id: {
                type: String,
                required: false,
            },
            exam_cat: {
                type: String,
                required: false
            },
            exam_sub: {
                type: String,
                required: false
            },
            exam_sub_sub: {
                type: String,
                required: false,
            },
            exam_name: {
                type: String,
                required: false
            },
            exam_slug: {
                type: String,
                required: false
            },
            assign_test_type: {
                type: String,
                required: false
            },
            exam_type: {
                type: String,
                required: false
            },
            exam_code: {
                type: String,
                required: false
            },
            exam_level: {
                type: String,
                required: false
            },
            sect_cutoff: {
                type: String,
                required: false
            },
            sect_timing: {
                type: String,
                required: false
            },
            tot_questions: {
                type: String,
                required: false
            },
            tot_mark: {
                type: String,
                required: false,
            },
            mark_perquest: {
                type: String,
                required: false
            },
            neg_markquest: {
                type: String,
                required: false
            },
            total_time: {
                type: String,
                required: false
            },
            quest_type: {
                type: String,
                required: false
            },
            exam_type_cat: {
                type: String,
                required: false
            },
            exam_type_id: {
                type: String,
                required: false
            },
            exam_pos: {
                type: String,
                required: false
            },
            exam_status: {
                type: String,
                required: false
            },
            exam_add_type: {
                type: String,
                required: false
            },
            exam_add_id: {
                type: String,
                required: false
            },
            exam_add_name: {
                type: String,
                required: false
            },
            exam_date: {
                type: Date,
                default: Date.now
            },
            payment_flag: {
                type: String,
                required: false
            },
            selling_price: {
                type: String,
                required: false
            },
            offer_price: {
                type: String,
                required: false
            },
            ip_addr: {
                type: String,
                required: false
            },
            last_update: {
                type: Date,
                default: Date.nows
            },
                                                    
  }); 
  module.exports = mongoose.model("tbl__exam",ExamsSchema);

   
//-------------------------- Exams Model End ------------------------------//
