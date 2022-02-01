//-------------------------- Operator Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const OperatorSchema = new mongoose.Schema({
  
      
            op_id: {
                type: String,
                required: false,
               
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
                                                    
  }); 
  module.exports = mongoose.model("tbl__operator",OperatorSchema);

    

//-------------------------- Operator Model End ------------------------------//
