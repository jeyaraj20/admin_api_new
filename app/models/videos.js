//-------------------------- Notes Model Start ------------------------------//
"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const StudentSchema = new mongoose.Schema({
            videosId: {
                type: String,
                required: true,
                autoIncrement: true,
            },
            chapterId: {
                type: String,
                required: true
            },
            videosName: {
                type: String,
                required: true
            },
            videosDescription: {
                type: String,
                required: true
            },
            videosUrl: {
                type: String,
                required: true
            },
            videosPosition: {
                type: String,
                required: true
            },
            createdBy : {
                type: String,
                required: true
            },
            videosStatus: {
                type: String,
                required: true
            },
            thumbnailUrl : {
                type: String,
                required: true
            }
            
                                                 
  }); 
  module.exports = mongoose.model("tbl__videos",StudentSchema);

     

//-------------------------- Category Model End ------------------------------//
