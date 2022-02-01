//-------------------------- AutomaticQuestionDetails Model Start ------------------------------//
   
"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const AutomaticQuestionDetailsSchema = new mongoose.Schema({
  
  
            automatic_quest_id: {
                type: String,
                required: true,
                autoIncrement: true,
            },
            examid: {
                type: String,
                required: true
            },
            sectid: {
                type: String,
                required: true
            },
            catid: {
                type: String,
                required: true
            },
            subcatid: {
                type: String,
                required: true
            },
            noofquestions: {
                type: String,
                required: true
            },
            questionlevel: {
                type: String,
                required: true
            },
            activestatus: {
                type: String,
                required: true
            },
            createdby: {
                type: String,
                required: true
            },
            createdtimestamp: {
                type: Date,
                default: Date.now
            },
            updatedby: {
                type: String,
                required: true
            },
            updatedtimestamp: {
                type: Date,
                default: Date.now
            },
                       
  }); 
  module.exports = mongoose.model("tbl__automatic_question_details", AutomaticQuestionDetailsSchema);

  

//-------------------------- AutomaticQuestionDetails Model End ------------------------------//
