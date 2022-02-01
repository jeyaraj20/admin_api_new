//-------------------------- Questions Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const PassageQuestionsSchema = new mongoose.Schema({
  
   
            passage_question_id: {
                type: String,
                required: true,
                autoIncrement: true,
            },
            question_ref_id: {
                type: String,
                required: true
            },
            passage_q_type: {
                type: String,
                required: true
            },
            passage_question: {
                type: String,
                required: true
            },
            passage_quest_desc: {
                type: String,
                required: true
            },
            passage_opt_type1: {
                type: String,
                required: true
            },
            passage_opt_type2: {
                type: String,
                required: true
            },
            passage_opt_type3: {
                type: String,
                required: true
            },
            passage_opt_type4: {
                type: String,
                required: true
            },
            passage_opt_type5: {
                type: String,
                required: true
            },
            passage_opt_1: {
                type: String,
                required: true
            },
            passage_opt_2: {
                type: String,
                required: true
            },
            passage_opt_3: {
                type: String,
                required: true
            },
            passage_opt_4: {
                type: String,
                required: true
            },
            passage_opt_5: {
                type: String,
                required: true
            },
            passage_crt_ans: {
                type: String,
                required: true
            },
            passage_quest_add_id: {
                type: String,
                required: true
            },
            passage_quest_add_by: {
                type: String,
                required: true
            },
            passage_quest_pos: {
                type: String,
                required: true
            },
            passage_quest_status: {
                type: String,
                required: true
            },
            passage_quest_date: {
                type: Date,
                default: Date.now
            },
            passage_aproved_date: {
                type: Date,
                default: Date.now
            },
            passage_quest_ipaddr: {
                type: String,
                required: true
            },
            passage_lastupdate: {
                type: Date,
                default: Date.now
            },

                                                
  }); 
  module.exports = mongoose.model("tbl__passage_question",PassageQuestionsSchema);


 
//-------------------------- Questions Model End ------------------------------//
