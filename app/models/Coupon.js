//-------------------------- Category Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const CouponSchema = new mongoose.Schema({
  
        
         coupon_id: {
            type: String,
            required: false,
            },
            coupon_name: {
                type: String,
                required: false
            },
            coupon_code: {
                type: String,
                required: false,
            },
            coupon_value: {
                type: String,
                required: false
            },
            coupon_value_type: {
                type: String,
                required: false
            },
            cart_value_range: {
                type: String,
                required: false
            },
            cart_value_range_type: {
                type: String,
                required: false
            },
            cart_value: {
                type: String,
                required: false
            },
            no_of_usage: {
                type: String,
                required: false
            },
            no_of_usage_user: {
                type: String,
                required: false
            },
            from_date: {
                type: Date,
                default: Date.now
            },
            to_date: {
                type: Date,
                default: Date.now
            },
            coupon_status: {
                type: String,
                required: false
            },
                                    
  }); 
  module.exports = mongoose.model("tbl__coupon", CouponSchema);

  
   

//-------------------------- Category Model End ------------------------------//
