//-------------------------- Adminmenu Model Start ------------------------------//
    
"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const AdminmenuallSchema = new mongoose.Schema({
  
  
            menu_id: {
                type: String,
                required: false,
            },
            menu_title: {
                type: String,
                required: false
            },
            menu_title_apiname: {
                type: String,
                required: false
            },
            menu_type: {
                type: String,
                required: false
            },
            pid: {
                type: String,
                required: false
            },
            menu_link: {
                type: String,
                required: false
            },
            menu_icon: {
                type: String,
                required: false,
            },
            menu_home: {
                type: String,
                required: false
            },
            menu_pos: {
                type: String,
                required: false
            },
            menu_status: {
                type: String,
                required: false
            },
            menu_lastupdate: {
                type: Date,
                default: Date.now
            },
            menu_for: {
                type: String,
                required: false
            },
                 
  }); 
  module.exports = mongoose.model("tbl__adminmenu_all", AdminmenuallSchema);

  
//-------------------------- Adminmenu Model End ------------------------------//
