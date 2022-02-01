//-------------------------- Adminmenu Model Start ------------------------------//
       
    
"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const AdminmenuSchema = new mongoose.Schema({
  
            menu_id: {
                type: String,
                required: true,
            },
            menu_title: {
                type: String,
                required: true
            },
            menu_type: {
                type: String,
                required: true
            },
            pid: {
                type: String,
                required: true
            },
            menu_link: {
                type: String,
                required: true
            },
            menu_icon: {
                type: String,
                required: true
            },
            menu_home: {
                type: String,
                required: true
            },
            menu_pos: {
                type: String,
                required: true
            },
            menu_status: {
                type: String,
                required: true
            },
            menu_lastupdate: {
                type: Date,
                default: Date.now
            },  
        
  }); 
   module.exports = mongoose.model("tbl__adminmenu", AdminmenuSchema);
