//-------------------------- HomeMasterCategory Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const HomeMasterCategorySchema = new mongoose.Schema({
  
      
            id: {
                type: String,
                required: false
              
            },
            homecategoryid: {
                type: String,
                required: false
            },
            exa_cat_id: {
                type: String,
                required: false
            },
                                                    
  }); 
  module.exports = mongoose.model("tbl__home_master_category",HomeMasterCategorySchema);


//-------------------------- HomeMasterCategory Model End ------------------------------//
