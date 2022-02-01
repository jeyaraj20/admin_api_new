//-------------------------- Operator Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const SchoolOperatorSchema = new mongoose.Schema({
  
      
            op_id: {
                type: String,
                required: true,
                autoIncrement: true,
            },
            op_name: {
                type: String,
                required: true
            },
            op_uname: {
                type: String,
                required: true
            },
            op_password: {
                type: String,
                required: true
            },
            op_type: {
                type: String,
                required: true
            },
            feat_id: {
                type: String,
                required: true
            },
            op_status: {
                type: String,
                required: true
            },
            op_dt: {
                type: Date,
                default: Date.now
            },
            op_lastupdate: {
                type: Date,
                default: Date.now
            },
            schoolid: {
                type: String,
                required: true
            },
                                                    
  }); 
  module.exports = mongoose.model("tbl__school_operator",SchoolOperatorSchema);

      
//-------------------------- Operator Model End ------------------------------//
