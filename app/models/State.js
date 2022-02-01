//-------------------------- Category Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const StateSchema = new mongoose.Schema({
  
            state_id: {
                type: String,
                required: false,
            },
            country_id: {
                type: String,
                required: false
            },
            state_name: {
                type: String,
                required: false
            },
            country_code: {
                type: String,
                required: false
            },
            state_status: {
                type: String,
                required: false
            },
            lastdate: {
                type: Date,
                default: Date.now
            },
                                               
  }); 
  module.exports = mongoose.model("tbl__state",StateSchema);

        
//-------------------------- Category Model End ------------------------------//
