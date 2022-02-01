//-------------------------- Notes Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const NotesSchema = new mongoose.Schema({
  
      
            notesId: {
                type: String,
                required: false,
            },
            chapterId: {
                type: String,
                required: false
            },
            notesName: {
                type: String,
                required: false
            },
            notesType: {
                type: String,
                required: false
            },
            notesUrl: {
                type: String,
                required: false
            },
            notesPosition: {
                type: String,
                required: false
            },
            createdBy : {
                type: String,
                required: false
            },
            notesStatus: {
                type: String,
                required: false
            },
                                               
  }); 
  module.exports = mongoose.model("tbl__notes",NotesSchema);
      
//-------------------------- Category Model End ------------------------------//
