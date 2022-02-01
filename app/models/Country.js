//-------------------------- Category Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const CountrySchema = new mongoose.Schema({
  
        
            country_id: {
                type: String,
                required: true,
                autoIncrement: true
            },
            id: {
                type: String,
                required: true
            },
            iso: {
                type: String,
                required: true
            },
            country_name: {
                type: String,
                required: true
            },
            nicename: {
                type: String,
                required: true,
                unique: true
            },
            iso3: {
                type: String,
                required: true
            },
            numcode: {
                type: String,
                required: true
            },
            phonecode: {
                type: String,
                required: true
            },
            country_status: {
                type: String,
                required: true
            },
            lastupdate: {
                type: Date,
                default: Date.now
            },
                                      
  }); 
  module.exports = mongoose.model("tbl__country", CountrySchema);

  

//-------------------------- Category Model End ------------------------------//
