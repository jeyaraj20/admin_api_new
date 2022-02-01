//-------------------------- Category Model Start ------------------------------//


"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const DurationSchema = new mongoose.Schema({
  
      
            duration_id: {
                type: String,
                required: true,
                autoIncrement: true,
            },
            duration: {
                type: String,
                required: true
            },
                                           
  }); 
  module.exports = mongoose.model("tbl__duration",DurationSchema);


//-------------------------- Category Model End ------------------------------//
