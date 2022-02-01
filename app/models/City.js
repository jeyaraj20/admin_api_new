//-------------------------- Category Model Start ------------------------------//
   
"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const CitySchema = new mongoose.Schema({
  
            city_id: {
                type: String,
                required: false
               
            },
            state_id: {
                type: String,
                required: false
            },
            city_name: {
                type: String,
                required: false
            },
            city_code: {
                type: String,
                required: false
            },
            city_status: {
                type: String,
                required: false,
            },
            lastupdate: {
                type: Date,
                default: Date.now
            },
                                        
  }); 
  module.exports = mongoose.model("tbl__city", CitySchema);

  

//-------------------------- Category Model End ------------------------------//
