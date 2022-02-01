"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const S3 = require("../lib/s3");
const mongoose = serviceLocator.get("mongoose"); 

module.exports = {
    // 1. CreateImages
    create: async (req, res, next) => {
        try{
            const result = await S3.s3Upload(req.file);
            return({ statusCode : 200, message : "Image upload succesfully.", data : result });
        }catch(error){
            return({ statusCode : 201, message : "Image upload failed." });
        }
    },
    // 2. deleteImages
    delete: async (req, res, next) =>{
        try{
           // await S3.s3Delete(req.query.image);
            return({ statusCode : 200, message : "Image Deleted succesfully."});
        }catch(error){
            return({ statusCode : 201, message : "Image Deleted failed." });
        }
    }
};
