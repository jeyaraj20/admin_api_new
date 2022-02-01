//-------------------------- Questions Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const OperatorItemsSchema = new mongoose.Schema({
  
      
        
            order_items_id: {
                type: String,
                required: true,
                autoIncrement: true,
            },
            order_ref_id: {
                type: String,
                required: true
            },
            order_id: {
                type: String,
                required: true
            },
            exam_id: {
                type: String,
                required: true
            },
            order_type: {
                type: String,
                required: true
            },
            amount: {
                type: String,
                required: true
            },
            cgst: {
                type: String,
                required: true
            },
            sgst: {
                type: String,
                required: true
            },
            student_id: {
                type: String,
                required: true
            },
            payment_status: {
                type: String,
                required: true
            },
                                                       
  }); 
  module.exports = mongoose.model("tbl__orderitems",OperatorItemsSchema);


//-------------------------- Questions Model End ------------------------------//
