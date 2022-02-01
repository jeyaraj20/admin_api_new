//-------------------------- ExamQuestions Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const ExamQuestionsSchema = new mongoose.Schema({
  
            exq_id: {
                type: String,
                required: true,
                autoIncrement: true,
            },
            exam_id: {
                type: String,
                required: true
            },
            exam_cat: {
                type: String,
                required: true
            },
            exam_subcat: {
                type: String,
                required: true
            },
            sect_id: {
                type: String,
                required: true
            },
            exam_name: {
                type: String,
                required: true
            },
            exam_code: {
                type: String,
                required: true
            },
            quest_type: {
                type: String,
                required: true
            },
            quest_assigned_type: {
                type: String,
                required: true
            },
            quest_assigned_id: {
                type: String,
                required: true
            },
            quest_assigned_name: {
                type: String,
                required: true
            },
            qid: {
                type: String,
                required: true
            },
            cat_id: {
                type: String,
                required: true
            },
            sub_id: {
                type: String,
                required: true
            },
            q_type: {
                type: String,
                required: true
            },
            question: {
                type: String,
                required: true
            },
            quest_desc: {
                type: String,
                required: true
            },
            opt_type1: {
                type: String,
                required: true
            },
            opt_type2: {
                type: String,
                required: true
            },
            opt_type3: {
                type: String,
                required: true
            },
            opt_type4: {
                type: String,
                required: true
            },
            opt_type5: {
                type: String,
                required: true
            },
            opt_1: {
                type: String,
                required: true
            },
            opt_2: {
                type: String,
                required: true
            },
            opt_3: {
                type: String,
                required: true
            },
            opt_4: {
                type: String,
                required: true
            },
            opt_5: {
                type: String,
                required: true
            },
            crt_ans: {
                type: String,
                required: true
            },
            quest_level: {
                type: String,
                required: true
            },
            exam_queststatus: {
                type: String,
                required: true
            },
            exam_questpos:{
                type: String,
                required: true
            },
            exam_questadd_date: {
                type: String,
                required: true
            },
            ip_addr: {
                type: String,
                required: true
            },
            last_update: {
                type: Date,
                default: Date.now
            },
                                                  
  }); 
  module.exports = mongoose.model("tbl__examquestions",ExamQuestionsSchema);


//-------------------------- ExamQuestions Model End ------------------------------//
