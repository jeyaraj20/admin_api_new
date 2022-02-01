//-------------------------- ExamRatings Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const ExamRatingsSchema = new mongoose.Schema({
  
      
            id: {
                type: String,
                required: false,
            },
            exa_cat_id: {
                type: String,
                required: false
            },
            examcat_type: {
                type: String,
                required: false
            },
            exa_rating: {
                type: String,
                required: false
            },
            exa_icon_image: {
                type: String,
                required: false
            },
                                                    
  }); 
  module.exports = mongoose.model("tbl__exam_ratings",ExamRatingsSchema);


    

//-------------------------- ExamRatings Model End ------------------------------//
