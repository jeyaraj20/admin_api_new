//-------------------------- Category Model Start ------------------------------//
   
"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const CategorySchema = new mongoose.Schema({
  
  
            cat_id: {
                type: String,
                required: false,
            },
            pid: {
                type: String,
                required: false
            },
            cat_name: {
                type: String,
                required: false
            },
            cat_slug: {
                type: String,
                required: false
            },
            cat_code: {
                type: String,
                required: false,
                unique: false,
            },
            cat_desc: {
                type: String,
                required: false
            },
            cat_image: {
                type: String,
                required: false
            },
            cat_pos: {
                type: String,
                required: false
            },
            cat_status: {
                type: String,
                required: false
            },
            cat_dt: {
                type: Date,
                default: Date.now
            },
            cat_lastupdate: {
                type: Date,
                default: Date.now
            },
                              
  }); 
  module.exports = mongoose.model("tbl__category", CategorySchema);

  

//-------------------------- Category Model End ------------------------------//
