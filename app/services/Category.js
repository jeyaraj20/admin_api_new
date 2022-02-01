"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose"); 
const moment = serviceLocator.get("moment"); 
const Category = mongoose.model("tbl__category");

module.exports = {
    // 1. Get All Active Category
    getAllActiveCategory: async (req, res, next) => {
        try {
            const  rows  = await Category.find({
               cat_status: "Y",
               pid: 0 
            }).sort({ cat_pos: 1 });
            if (!rows) {
                return jsend(404,"Category Not Found !!!");
            }else {
            const count = rows.length;
            return  jsend(200,"data received Successfully",{ count, category: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Category : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 2. GetAllCategoryByAsc
    getAllCategoryByAsc: async (req, res, next) => {
        try {
           const rows = await Category.aggregate([ 
              //  {$limit:300},                   
                { "$match":{ 
                     cat_status:"Y",
                        pid:"0",
            }},  
            {$sort:{
              "bincat":1,
            "cat_name":-1}},
               
              {$project:{bincat:[{    cat_id:"$cat_id",
              pid:"$pid",
              cat_name:"$cat_name",}],
              // bincat:IF(CAST(cat_name as signed)= 0,1000,CAST(cat_name as signed))
             cat_slug:1,cat_code:1,cat_desc:1,cat_image:1,cat_pos:1,cat_status:1,cat_dt:1,cat_lastupdate:1,
                _id:0 ,count:{$sum:1} }}                 
                  ])

            if (!rows) {
                return jsend(404,"Category Not Found !!!");
            }else{
                const count = rows.length;
                return jsend(200, "data received Successfully",
                { count, category: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Category : ${error.message}`);
            return jsend(500, error.message);
        }
    },
    // 3. Get Category By Id
    getCategoryById: async (req, res, next) => {
        try {
            const { catId } = req.params;
            if (catId == 0) return jsend(400, "Please send valid request data");

            const category = await Category.findOne({
                    cat_id: catId,
                    cat_status: "Y",
            });
            
            if (!category) return jsend(400, "Category Not Found !!!");
            return  jsend(200,"data received Successfully",{ category });
        } catch (error) {
            logger.error(`Error at Get Category By Id : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 4. Get Category By Position
    getCategoryByPosition: async (req, res, next) => {
        try {
            const { position } = req.params;
            if (position == 0) return jsend(400, "Please send valid request data");

            const category = await Category.find({
              
                    cat_pos: position,
                    cat_status: "Y",
            }).sort({ cat_name: 1 });

            if (!category) {
                return(404,"Category Not Found !!!");
            }else{
            return  jsend(200,"data received Successfully",{ category });
            }
        } catch (error) {
            logger.error(`Error at Get Category By Position : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 5. Create Category
    createCategory: async (req, res, next) => {
        try {
            const { cat_name, cat_slug, cat_pos } = req.payload;
            if (!cat_name || !cat_slug || !cat_pos) return jsend(400, "Please send valid request data");

          const message=  await Category.create({
                pid: "0",
                schoolid: "1",
                cat_name,
                cat_slug,
                cat_code: "",
                cat_desc: "",
                cat_image: "",
                cat_pos,
                cat_status: "Y",
                cat_dt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                cat_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            })
            .catch((err) => { return jsend(500,err.message);  });  
          if(message){
                return jsend(200, "data received Successfully",
                { message })
            }else{
                return jsend(500,"Please try again after sometime");
            }
        } catch (error) {
            logger.error(`Error at Create Category : ${error.message}`);
            return jsend(500,err.message);
        }
    },
    // 6. Update Category By Id
    updateCategoryById: async (req, res, next) => {
        try {
            const { catId } = req.params;
            if (catId == 0)  return jsend(400, "Please send valid request data");

            const { cat_name, cat_slug, cat_pos } = req.payload;
            if (!cat_name || !cat_slug || !cat_pos)  return jsend(400, "Please send valid request data");

           const result= await Category.findOneAndUpdate({ cat_id: catId } ,
                {
                    cat_name,
                    cat_slug,
                    cat_pos,
                    cat_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                }
                
            ) .catch((err) => {
                    return jsend(500, error.message)
                });
                if(result){
                    return jsend(200, "data received Successfully",
                    { message: "Updated Success" })
                }else{
                    return jsend(500, "Please try again after sometime" )
                }
        } catch (error) {
            logger.error(`Error at Update Category : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 7. Update 'Inactive'
    updateInactiveById: async (req, res, next) => {
        try {
            const { catId, status } = req.payload;
            if (!catId || !status) return jsend(400, "Please send valid request data");

           const result= await Category.findOneAndUpdate({ cat_id: catId } ,{ cat_status: status }  )
                .catch((err) => {
                    return jsend(500, err.message)
                });
                if(result){
                    return jsend(200, "data received Successfully",
                    { message: "Updated Success" })
                }else{
                    return jsend(500,"Please try again after sometime");
                }
        } catch (error) {
            logger.error(`Error at Update Category Status : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 8. Update 'Delete'
    updateDeleteById: async (req, res, next) => {
        try {
            const { catId } = req.payload;
            if (!catId) return jsend(400, "Please send valid request data");

           const result= await Category.findOneAndUpdate(  { cat_id: catId , cat_status: "D" }, )
             .catch((error) => {
            return jsend(500, error.message)
        });
        if(result){
            return jsend(204,"data deleted successfully",result)
        }else{
            return jsend(500,"Please try again after sometime")
        }     
        } catch (error) {
            logger.error(`Error at Delete Category : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 9.  Update 'Position'
    updatePositionById: async (req, res, next) => {
        try {
            const { values } = req.payload;
            if (!values) return jsend(400, "Please send valid request data");
  if(values && values.length>0)
  {
    values.forEach(async (val) => {
        await Category.findOneAndUpdate({
            
            cat_id:val.catId,
             cat_pos: val.position               
        });
    });
    return jsend(200, "Update Success !!!");
            }else{
                   return jsend(500, "Please send valid data")
            }
        } catch (error) {
            logger.error(`Error at Update Category Position : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 10. Get All InActive Category
    getAllInactiveCategory: async (req, res, next) => {
        try {
            const rows  = await Category.find({
                cat_status: "N",
                 pid: 0 
               
            }).sort({ cat_pos: 1 });

            if (!rows) {
                       return jsend(404,"Category Not Found !!!");
            }else {
            const count = rows.length;
            return  jsend(200,"data received Successfully",{ count, category: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Inactive Category : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 11. Category By Name
    getCategoryByName: async (req, res, next) => {
        try {
            let { cat_name } = req.params;
            const rows  = await Category.find({
               cat_name: cat_name,
                 pid: 0 
            });
            if (!rows) {
                return jsend(500, error.message)
            }else {
            const count = rows.length;
            return  jsend(200,"data received Successfully",{ count, category: rows });
            }
        } catch (error) {
            logger.error(`Error at Get Category By Name : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 12. Get QBank Main Category Count Only
    getCategoryCount: async (req, res, next) => {
        try {
            const { cat_status } = req.params;
            if (cat_status == null) return jsend(400, "Please send valid request data");
            const count = 0;
            count = await Category.count({
                cat_status, pid: 0 
            }).catch((err) => {
                return jsend(500, error.message);
            });
            return  jsend(200,"data received Successfully",{ count });
        } catch (error) {
            logger.error(`Error at Get QBank Main Category Count Only : ${error.message}`);
            return jsend(500, error.message);
        }
    },
};
