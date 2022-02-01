"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose"); 
const moment = serviceLocator.get("moment"); 
const Coupon = mongoose.model("tbl__coupon");
const Duration = mongoose.model("tbl__duration");
// const { is_string } = require("locutus/php/var");

 module.exports = {
     // 1. GetAllDurations
    getAllDurations: async (req, res, next) => {
        try {
            const [durations] = await Duration.find(
            );
            if (!durations) {
                return jsend(404,"Duration Not Found !!!");
            }else{
                const count = durations.duration_id.length;
            return jsend(200, "data received Successfully",{count, durations });
            }
        } catch (error) {
            logger.error(`Error at Get All Exam Package : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 2. GetAllCoupons
    getAllCoupons: async (req, res, next) => {
        try {
            const { status } = req.params;
            const [coupon] = await Coupon.find(
            { "$match":{ 
                coupon_status:status,
          }}
        );
            if (!coupon) {
                return jsend(404,"Coupon Not Found !!!");
            }else{
                return jsend(200, "data received Successfully", 
                { count: coupon.length, coupon });
            }
        } catch (error) {
            logger.error(`Error at Get All Coupon : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 3. CreateCoupon
    createCoupon: async (req, res, next) => {
        try {
            const { coupon_name, coupon_code, coupon_value, coupon_value_type, cart_value_range,
                 cart_value_range_type, cart_value, no_of_usage, no_of_usage_user, 
                 from_date, to_date } = req.payload;
            if (!coupon_name || !coupon_code || !coupon_value || !coupon_value_type) 
            return jsend(400, "Please send valid request data");
            
                  const postData =  await Coupon.create({
                        coupon_name,
                        coupon_code,
                        coupon_value,
                        coupon_value_type,
                        cart_value_range,
                        cart_value_range_type,
                        cart_value_range_type,
                        cart_value,
                        no_of_usage,
                        no_of_usage_user,
                        from_date,
                        to_date,
                        coupon_status: 'Y'
                    })
                
                .catch((err) => {
                    return jsend(404,err.message);
                });
                if(postData){
                    return jsend(200, "data received Successfully", 
                    { message: "Insert Success",postData });
                }else{
                    return jsend(500, "Please try again after sometime")
                }
                
        } catch (error) {
            logger.error(`Error at Create Coupon : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 4. UpdateCoupon
    updateCoupon: async (req, res, next) => {
        try {
            const { coupon_id } = req.params;
            if (coupon_id == 0) return jsend(400, "Please send valid request data");

            const { coupon_name, coupon_code, coupon_value, coupon_value_type, cart_value_range,
                 cart_value_range_type, cart_value, no_of_usage, no_of_usage_user,
                  from_date, to_date } = req.payload;
            if (!coupon_name || !coupon_code || !coupon_value || !coupon_value_type) 
            return jsend(400, "Please send valid request data");
           const result= await Coupon.findOneAndUpdate(
                {  coupon_id: coupon_id } ,
                {
                    coupon_name,
                    coupon_code,
                    coupon_value,
                    coupon_value_type,
                    cart_value_range,
                    cart_value_range_type,
                    cart_value_range_type,
                    cart_value,
                    no_of_usage,
                    no_of_usage_user,
                    from_date,
                    to_date
                }
              
              ) .catch((err) => {
                return jsend(404,err.message);
            });
                if(result)  {
                    return jsend(200, "data received Successfully",
                    { message: "Updated Success" })
                }else{
                    return jsend(500, "Please try again after sometime")
                }
               
        } catch (error) {
            logger.error(`Error at Update Exam Package : ${error.message}`);
            return jsend(500, error.message)
        }
     },
     // 5. Update 'Active / Inactive / Delete'
     updateStatusById: async (req, res, next) => {
        try {
            const { couponId, status } = req.payload;
            if (!couponId || !status) return jsend(400, "Please send valid request data");
                   const result= await Coupon.findOneAndUpdate(
                       { coupon_id: couponId},
                      {coupon_status: status }).catch((err) => {
                        return jsend(500,err.message);
                    });
               if(result){
                return jsend(200, "data received Successfully",
                { message: "Update Success !!!",result })
               }else{
                return jsend(500, "Please try again after sometime" )
               }
            } catch (error) {
            logger.error(`Error at Update Exam Package Status : ${error.message}`);
            return jsend(500, error.message)
        }
    },

};
