"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose"); 
const moment = serviceLocator.get("moment"); 
const HomeCategory = mongoose.model("tbl__home_category");
const HomeMasterCategory = mongoose.model("tbl__home_master_category");

module.exports = {
    // 1. Get All Active Home Category
    getAllActiveHomeCategory: async (req, res, next) => {
        try {
            console.log(req.payload.user);
            const  rows  = await HomeCategory.find({
                exa_cat_status: "Y" 
            }).sort({ exa_cat_pos: 1 });

            if (!rows) {
                return jsend(404,"Home Category Not Found !!!");
            }else{
            const count = rows.length;
            return jsend(200, "data received Successfully",{ count, category: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Home Category : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    
    // 2. Get Home Category By Id
    getHomeCategoryById: async (req, res, next) => {
        try {
            const { catId } = req.params;
            if (catId == null)  return jsend(400, "Please send valid request data");

            const category = await HomeCategory.findOne({
                    exa_cat_id: catId,
                    exa_cat_status: "Y",
            });
            if (!category){
                return jsend(404,"Home Category Not Found !!!");
            }else{
            return jsend(200, "data received Successfully",
            { category });
            }
        } catch (error) {
            logger.error(`Error at Get Home Category By Id : ${error.message}`);
            return jsend(500, error.message)
        }
    },

    // 3. Get Home Category By Position
    getHomeCategoryByPosition: async (req, res, next) => {
        try {
            const { position } = req.params;
            if (position < 0)  return jsend(400, "Please send valid request data");

            const  rows  = await HomeCategory.find({
              
                    exa_cat_pos: position,
                    exa_cat_status: "Y",
            }).sort({ exa_cat_name: 1 });
            if (!rows){
                return jsend(404,"Home Category Not Found !!!");
            }else{
          const count = rows.length;
          return jsend(200, "data received Successfully",
          { count, category: rows });
            }
        } catch (error) {
            logger.error(`Error at Get Home Category By Position : ${error.message}`);
            return jsend(500, error.message)
        }
    },

    // 4. Create Home Category
    createHomeCategory: async (req, res, next) => {
        //const t = await db.sequelize.transaction();
        try {
           // const { file } = req;
          //  if (!file)return jsend(400, "Please send valid request data");
            const {
                exaid, exaid_sub, examcat_type, exa_cat_name, exa_cat_slug, exa_cat_pos, exa_cat_id,
                exa_cat_desc } = req.payload;
            const homeCategory = await HomeCategory.create(
              {  exaid,
                exaid_sub,
                examcat_type,
                exa_cat_name,
                exa_cat_slug,
                exa_cat_pos,
                exa_cat_desc,
              //  exa_cat_image: file.filename,
                exa_cat_status: "Y",
                exa_cat_dt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                exa_cat_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
              }
            ).catch((err) => {
                return jsend(404,"Please try again after sometime");
            });
      const result =  await HomeMasterCategory.create(
                {
                    homecategoryid: homeCategory.exa_cat_id,
                    exa_cat_id: exa_cat_id,
                }
          
            ).catch((err) => {
                return jsend(404,"Please try again after sometime");
            });
            if(result){
                return jsend(200, "data received Successfully",
                { message: "Exam Main Category Created"})
            }else{
                return jsend(500, "Please try again after sometime")
            }
        } catch (error) {
            logger.error(`Error at Create Home Category : ${error.message}`);
            return jsend(500, "Please try again after sometime");
        }
    },

    // 5. Update Home Category By Id
    updateHomeCategoryById: async (req, res, next) => {
        try {
          //  const { file } = req;
            //  if (!file) throw createError.NotFound("No File");

            const { catId } = req.params;
            if (catId == null)  return jsend(400, "Please send valid request data");

        const {exaid, exaid_sub,examcat_type,exa_cat_name, exa_cat_slug, exa_cat_pos, exa_cat_id,
                exa_cat_desc } = req.payload;

           // if (file) {
                const homeCategory = await HomeCategory.findOneAndUpdate({ exa_cat_id: catId } ,
                    {
                        exaid,
                        exaid_sub,
                        examcat_type,
                        exa_cat_name,
                        exa_cat_slug,
                        exa_cat_pos,
                        exa_cat_desc,
                       // exa_cat_image: file.filename,
                        exa_cat_dt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        exa_cat_lastupdate: moment(Date.now()).format(
                            "YYYY-MM-DD HH:mm:ss"
                        )}
                 
                ).catch((err) => {
                    return jsend(404,err.message);
                });

                const created = await HomeMasterCategory.create(
                    {
                        homecategoryid: catId,
                        defaults: {
                            homecategoryid: catId,
                            exa_cat_id: exa_cat_id,
                        },
                    }
                ).catch((err) => {
                    return jsend(404,err.message);
                });

                if (!created) {
                    await HomeMasterCategory.findOneAndUpdate(   {  homecategoryid: catId } ,
                        {
                            homecategoryid: catId,
                            exa_cat_id: exa_cat_id,
                        },
                     
                    ).catch((err) => {
                        return jsend(404,err.message);
                    });
                }

           // }
             else {
                const homeCategory = await HomeCategory.findOneAndUpdate( { exa_cat_id: catId },
                    {
                        exaid,
                        exaid_sub,
                        examcat_type,
                        exa_cat_name,
                        exa_cat_slug,
                        exa_cat_pos,
                        exa_cat_desc,
                        exa_cat_dt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        exa_cat_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss" ),
                    },
                   
                ).catch((err) => {
                    return jsend(404,err.message);
                });
                const created = await HomeMasterCategory.create(
                    {
                        homecategoryid: catId ,
                        defaults: {
                            homecategoryid: catId,
                            exa_cat_id: exa_cat_id,
                        },
                    }
                ).catch((err) => {
                    return jsend(404,err.message);
                });

                await HomeMasterCategory.findOneAndUpdate(  { homecategoryid: catId } ,
                    {
                        homecategoryid: catId,
                        exa_cat_id: exa_cat_id,
                    },
                  
                ).catch((err) => {
                    return jsend(404,err.message);
                });
            }
            return jsend(200, "data received Successfully",created,
            { message: "Home Exam Main Category Updated" });
        } catch (error) {
            logger.error(`Error at Update Home Category : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 6. Update 'Status'
    updateInactiveById: async (req, res, next) => {
        try {
            const { catId, status } = req.payload;
            if (!catId || !status)  return jsend(400, "Please send valid request data");
            const result=   await HomeCategory.findOneAndUpdate(
                        { exa_cat_status: status },
                        {  exa_cat_id: catId  },
      ).catch((err) => {
                    return jsend(500,err.message);
                });
           if(result){
            return jsend(200, "data received Successfully",
            { message: "Update Success !!!" })
           }else{
            return jsend(500, "Please try again after sometime" )
           }
        } catch (error) {
            logger.error(`Error at Update Exam Status : ${error.message}`);
            return jsend(500, error.message)
        }
    },

    // 7. Update 'Delete'
    updateDeleteById: async (req, res, next) => {
        try {
            const { catId } = req.payload;
            if (!catId)  return jsend(400, "Please send valid request data");

           const  result  =   await HomeCategory.findOneAndUpdate( [
                        {  exa_cat_id: catId },
                        { exa_cat_status: "D" },
                     
            ]       ).catch((err) => {
                return jsend(500,err.message);
            });
        
       if(result){
        return jsend(200, "data received Successfully",
        { message:result })
       }else{
        return jsend(500, "Please try again after sometime" )
       }
    } catch (error) {
        logger.error(`Error at Update Exam Status : ${error.message}`);
        return jsend(500, error.message)
    }
},

    // 8. Update 'Position'
    updatePositionById: async (req, res, next) => {
        try {
            const { values } = req.payload;
            if (!values) return jsend(400, "Please send valid request data");
               values.forEach(async (val) => {
            await HomeCategory.findOneAndUpdate(
                { exa_cat_pos:val.position ,
                    exa_cat_id: val.catId }
               )
            });
               return jsend(200, "data received Successfully", { values })
        } catch (error) {
            logger.error(`Error at Update Home Category Position : ${error.message}`);
            return jsend(500, error.message)
        }
    },

    // 9. Get All InActive Home Category
    getAllInactiveHomeCategory: async (req, res, next) => {
        try {
            const rows  = await HomeCategory.find({
                 exa_cat_status: "N",
            }).sort({ exa_cat_pos: 1 })
            .catch((err) => {
                return jsend(400, "Please send valid request data");
            });
            if (!rows) {
                return jsend(400, "Home Category Not Found !!!");
            }else{
            const count = rows.length;
            return({ count, category: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Inactive Home Category : ${error.message}`);
            return jsend(500, error.message)
        }
    },

    // 10. Get Home Category By Name
    getHomeCategoryBycategoryName: async (req, res, next) => {
        try {
            const { catName } = req.params;
            if (catName == null)  return jsend(400, "Please send valid request data");

            const category = await HomeCategory.findOne({
             exa_cat_name: catName ,
            }).catch((err) => {
                return jsend(400, "Please send valid request data");
            });
            if (!category) {
                return jsend(404,"Home Category Not Found !!!");
            }else{
                return jsend(200, "data received Successfully",
                { category });
            }
        } catch (error) {
            logger.error(`Error at Get Home Category By Name : ${error.message}`);
            return jsend(500, error.message)
        }
    },

    // 11. Get Home Category Search Result
    getSearchResult: async (req, res, next) => {
        try {
            const { searchString } = req.payload;
            if (searchString == null) return jsend(400, "Please send valid request data");

            const  rows = await HomeCategory.find({
            
                    $or: [
                        {
                            exa_cat_name: { $regex : '.*'+ searchString + '.*' },
                        },
                    ],
                    exa_cat_status: { $ne: "D" },
             
                
            // $or:[ {exa_cat_name: { $regex : '.*'+ searchString + '.*' }}],
            // exa_cat_status: { $ne: "D" },
            
            }).catch((err) => {
                return jsend(400, "Please send valid request data",err.message);
            });
            if (!rows ){
                return jsend(404,"Home Category Not Found !!!");
            }else{
          const count =rows.length
             return jsend(200, "data received Successfully",
             { count, category: rows });
            }
        } catch (error) {
            logger.error(`Error at Home Category Search : ${error.message}`);
            return jsend(500, error.message)
        }
    },

    // 12. Get Count Only
    getCountOnly: async (req, res, err) => {
        try {
            const { status } = req.params;
            if (status == null)  return jsend(400, "Please send valid request data");
            let count = 0;
            count = await HomeCategory.count({
                 exa_cat_status: status ,
            }).catch((err) => {
                return jsend(500, error.message);
            });
         return jsend(200, "data received Successfully",{ count });
        } catch (error) {
            logger.error(`Error at Home Category Count Only : ${error.message}`);
            return jsend(500, error.message);
        }
    },
};
