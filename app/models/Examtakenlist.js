//-------------------------- Admin Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const ExamtakenlistSchema = new mongoose.Schema({
  
            taken_id: {
                type: String,
                required: true,
                autoIncrement: true,
            },
            stud_id: {
                type: String,
                required: true
            },
            exam_id: {
                type: String,
                required: true
            },
            exam_type: {
                type: String,
                required: true
            },
            exam_type_cat: {
                type: String,
                required: true
            },

            exam_type_id: {
                type: String,
                required: true
            },
            post_mark: {
                type: String,
                required: true
            },
            neg_mark: {
                type: String,
                required: true
            },
            tot_quest: {
                type: String,
                required: true
            },
            
            tot_attend: {
                type: String,
                defaultValue: 0.0,
            },
            not_attend: {
                type: String,
                defaultValue: 0.0,
            },
            not_answered: {
                type: String,
                defaultValue: 0.0,

            },

            skip_quest: {
                type: String,
                defaultValue: 0.0,

            },

            answ_crt: {
                type: String,
                defaultValue: 0.0,

            },

            answ_wrong: {
                type: String,
                defaultValue: 0.0,

            },
            tot_postimark: {
                type: String,
                defaultValue: 0.0,

            },
            tot_negmarks: {
                type: String,
                defaultValue: 0.0,

            },

            total_mark: {
                type: String,
                defaultValue: 0.0,
            },
            
            start_time: {
                type: Date,
                default: Date.now
            },

            end_time: {
                type: Date,
                defaultValue: '2000-01-01 00:00:00',
            },
            exam_status: {
                type: String,
                required: true
            },
            ip_addr: {
                type: String,
                required: true
            },
            lastupdate: {
                type: Date,
                default: Date.now
            }
            
        
                                          
  }); 
  module.exports = mongoose.model("tbl__examtaken_list",ExamtakenlistSchema);


//-------------------------- Admin Model End ------------------------------//
