//-------------------------- Admin Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const AdminSchema = new mongoose.Schema({
  

    admin_id: {
        type: String,
        required: true
    },
    admin_name: {
        type: String,
        required: true
    },
    admin_pass: {
        type: String,
        required: true
    },
    admin_status: {
        type: String,
        required: true
    },
    sitename: {
        type: String,
        required: true
    },
    set_url: {
        type: String,
        required: true
    },
    setting_fields: {
        type: String,
        required: true
    },
    setting_operator: {
        type: String,
        required: true
    },
    setting_logo: {
        type: String,
        required: true
    },
    setting_banner: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    },
    lastupdate: {
        type: Date,
        default: Date.now
    },
    
}); 
module.exports = mongoose.model("tbl__admin", AdminSchema);


//-------------------------- Admin Model End ------------------------------//
