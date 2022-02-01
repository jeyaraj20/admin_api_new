//-------------------------- Questions Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const QuestionsSchema = new mongoose.Schema({
  
            qid: {
                type: String,
                required: false
            },
            cat_id: {
                type: String,
                required: false
            },
            sub_id: {
                type: String,
                required: false
            },
            quest_add_type: {
                type: String,
                required: false
            },
            q_type: {
                type: String,
                required: false
            },
            question: {
                type: String,
                required: false
            },
            question_code: {
                type: String,
                required: false
            },
            op_uname: {
                type: String,
                required: false
            },
            quest_desc: {
                type: String,
                required: false
            },
            opt_type1: {
                type: String,
                required: false
            },
            opt_1: {
                type: String,
                required: false
            },
            opt_type2: {
                type: String,
                required: false
            },
            opt_type3: {
                type: String,
                required: false
            },
            opt_type4: {
                type: String,
                required: false
            },
            opt_type5: {
                type: String,
                required: false
            },
            opt_2: {
                type: String,
                required: false
            },
            opt_3: {
                type: String,
                required: false
            },
            opt_4: {
                type: String,
                required: false
            },
            opt_5: {
                type: String,
                required: false
            },
            crt_ans: {
                type: String,
                required: false
            },
            quest_level: {
                type: String,
                required: false
            },
            quest_add_id: {
                type: String,
                required: false
            },
            quest_add_by: {
                type: String,
                required: false
            },
            quest_pos: {
                type: String,
                required: false
            },
            quest_status: {
                type: String,
                required: false
            },
            quest_date: {
                type: Date,
                default: Date.now
            },
            aproved_date: {
                type: Date,
                default: Date.now
            },
            quest_ipaddr: {
                type: String,
                required: false
            },
            lastupdate: {
                type: Date,
                default: Date.now
            },
                                                  
  }); 
  module.exports = mongoose.model("tbl__question",QuestionsSchema);

        
//-------------------------- Questions Model End ------------------------------//
