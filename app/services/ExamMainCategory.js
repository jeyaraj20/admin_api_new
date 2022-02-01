"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose"); 
const moment = serviceLocator.get("moment"); 
const ExamMainCategory = mongoose.model("tbl__exam_category");
const ExamRatings = mongoose.model("tbl__exam_ratings");
const HomeMasterCategory = mongoose.model("tbl__home_master_category");
const ExamChapters = mongoose.model("tbl__examchapters");
const ExamCategory = mongoose.model("tbl__exam_category");

module.exports = {
    // 1. Get All Master Category
    getAllMasterCategory: async (req, res, next) => {
        try {
            const  rows  = await ExamMainCategory.find({
                    examcat_type: "M",
                    exa_cat_status: "Y",
                    exaid: 0,
                    exaid_sub: 0,
            }).sort({ exa_cat_name: 1,ASC:1 });
            if (!rows) {
                return jsend(404,"Exam Master Category Not Found !!!");
            }else{
                const count = rows.length;
                return jsend(200, "data received Successfully",{ count, category: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Master Category : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 2. Get All Main Category
    getAllMainCategory: async (req, res, next) => {
        try {
            const { masterId } = req.params;
            if (!masterId)  return jsend(400, "Please send valid request data");
            const  rows  = await ExamMainCategory.find({
                
                    examcat_type: "C",
                    exa_cat_status: "Y",
                    exaid: masterId,
                    exaid_sub: 0,
            }).sort({ exa_cat_pos: 1 });

            if (!rows){
                return jsend(404,"Exam Main Category Not Found !!!");
            }else{
            const count = rows.length;
            return jsend(200, "data received Successfully",
            { count, category: rows });
        }
        } catch (error) {
            logger.error(`Error at Get All Exam Main Category : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 3. GetAllSubCategory
    getAllSubCategory: async (req, res, next) => {
        try {
            const { catId } = req.params;
            if (!catId) return jsend(400, "Please send valid request data");
            const  rows  = await ExamMainCategory.find({
                    examcat_type: "S",
                    exa_cat_status: "Y",
                    exaid_sub: catId,
            }).sort({ exa_cat_pos: 1 });

            if (!rows){ 
                return jsend(404,"Exam sub Category Not Found !!!");
        }else{
            const count = rows.length;
         return jsend(200, "data received Successfully",
         { count, subcategory: rows });
        }
        } catch (error) {
            logger.error(`Error at Get All Exam Sub Category : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 4.  Get All Main Category
    getAllExamMainCategory: async (req, res, next) => {
        try {
            const { status } = req.params;
      const [category] = await ExamCategory.aggregate([ 
                {$limit:300},                   
                { "$match":{ 
                 // examcat_type!:'S',
                  exa_cat_status:status
            }},
                  { '$lookup': {
               'from': "tbl__exam_category",
               'localField': 'exaid',
               'foreignField': 'exa_cat_id',
               'as': 'ExamData'
             }},                      
              { "$unwind": "$ExamData" },                     
              { '$lookup': {
                'from': "tbl__exam_ratings",
                'localField': 'exa_cat_id',
                'foreignField': 'exa_cat_id',
                'as': 'ExamChapters'
              }},                     
               { "$unwind": "$ExamChapters" },   
            
             {$project:{
              MasterName:"$ExamData.exa_cat_name",
                ExamData:"$ExamData",
                exa_rating:"$ExamChapters.exa_rating",
                exa_icon_image:"$ExamChapters.exa_icon_image",
                _id:0 ,count:{$sum:1} }}                 
                  ])
            if (!category) return jsend(400, "Exam Main Category Not Found !!!");
            return jsend(200,{ count: category.length, category });
        } catch (error) {
            logger.error(`Error at Get All Main Category : ${error.message}`);
            return jsend(500,error.message);
        }
    },
    // 5. GetAllInactiveExamMainCategory
    getAllInactiveExamMainCategory: async (req, res, next) => {
        try {
            const  rows  = await ExamMainCategory.find({
                    examcat_type: "M",
                    exa_cat_status: "N",
                    exaid: 0,
                    exaid_sub: 0,
            }).sort({ exa_cat_pos: 1 });

            if (!rows) {
                return jsend(404,"Exam Main Category Not Found !!!");
            }else{
                const count = rows.length;
                return jsend(200, "data received Successfully",
                { count, category: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Inactive Exam Main Category : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 6. Get Exam Main Category By Id
    getExamMainCategoryById: async (req, res, next) => {
        try {
            const { catId } = req.params;
            if (catId == null)  return jsend(400, "Please send valid request data");
            const category = await ExamMainCategory.findOne({
                    exa_cat_id: catId,
                    exa_cat_status: "Y",
            });
            if (!category) {
                return jsend(500,"Exam Main Category Not Found !!!");
            }else{
                return jsend(200, "data received Successfully",{ category });
            }
        } catch (error) {
            logger.error(`Error at Get Exam Main Category Id: ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 7. Get Exam Main Category By Position
    getExamMainCategoryByPosition: async (req, res, next) => {
        try {
            const { position } = req.params;
            if (position == null)  return jsend(400, "Please send valid request data");

            const category = await ExamMainCategory.find({
                    exa_cat_pos: position,
                    exa_cat_status: "Y",
            }).sort({ exa_cat_name: 1 });

            if (!category) {
                return jsend(404,"Exam Main Category Not Found !!!");
            }else{
                return jsend(200, "data received Successfully",{ category });
            }
        } catch (error) {
            logger.error(`Error at Get Exam Main Category Position: ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 8. Create Exam Main Category
    createExamMainCategory: async (req, res, next) => {
        try {
           // const { file } = req;
          //  if (!file)  return jsend(400, "Please send valid request data");

            const { exaid,exaid_sub, examcat_type,exa_cat_name,exa_cat_slug,  exa_cat_pos,exa_cat_desc,
                payment_flag,  } = req.payload;
            const examMainCategory = await ExamMainCategory.create([
                {
                    exaid,
                    exaid_sub,
                    examcat_type,
                    exa_cat_name,
                    exa_cat_slug,
                    exa_cat_pos,
                    exa_cat_desc,
                    exa_cat_image: file.filename,
                    exa_cat_status: "Y",
                    exa_cat_dt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    exa_cat_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    payment_flag
                },
             ] ).catch((err) => {
                return jsend(400, "Please send valid request data",err.message);
            });

            const Exam = await ExamRatings.create(
                {
                    examcat_type,
                    exa_cat_id: examMainCategory.exa_cat_id,
                   // exa_icon_image: req.body.exa_icon_image,
                })
    
        .catch((err) => {
            console.log(err.message)
            return jsend(500,err.message);
        });       if(Exam){
            return jsend(200, "data received Successfully",
            { message:"Exam Main Category Created" })
        }else{
            return jsend(500,"Please try again after sometime");
        }
        } catch (error) {
            logger.error(`Error at Create Exam Main Category : ${error.message}`);
            return(error);
        }
    },
    // 9. Update Exam Main Category By Id
    updateExamMainCategoryById: async (req, res, next) => {
        try {
            const { file } = req;
            console.log(file);
            if (!file) return jsend(404,"No File");

            const { catId } = req.params;
            if (catId == null)  return jsend(400, "Please send valid request data");
            const {
                exaid, exaid_sub, examcat_type, exa_cat_name, exa_cat_slug,  exa_cat_pos, exa_cat_desc,
                exa_rating, exa_icon_image, payment_flag} = req.payload;
            await ExamMainCategory.findOneAndUpdate(  { exa_cat_id: catId } ,
                {
                    exaid,
                    exaid_sub,
                    examcat_type,
                    exa_cat_name,
                    exa_cat_slug,
                    exa_cat_pos,
                    exa_cat_desc,
                    exa_cat_image: file.filename,
                    exa_cat_status: "Y",
                    exa_cat_dt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    exa_cat_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    payment_flag
                },
            ).catch((err) => {
                return jsend(400, "Please send valid request data");
            });
            const [examRating, created] = await ExamRatings.findOrCreate({
               exa_cat_id: catId, examcat_type ,
                defaults: {
                    examcat_type,
                    exa_cat_id: catId,
                    exa_rating: exa_rating ? exa_rating : "",
                    exa_icon_image: exa_icon_image ? exa_icon_image : "",
                    transaction: t,
                },
            }).catch((err) => {
                return jsend(404,err.message);
            });
            if (!created) {
                await ExamRatings.findOneAndUpdate( { exa_cat_id: catId } ,
                    {
                        exa_rating: exa_rating ? exa_rating : "",
                        exa_icon_image: exa_icon_image ? exa_icon_image : "",
                    },
                ).catch((err) => {
                    return jsend(404,err.message);
                });
            }
            return jsend(200, "data received Successfully",
            { message: "Update Success !!!" });
        } catch (error) {
            logger.error(`Error at Update Exam Main Category : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 10. Update 'Active / Inactive / Delete'
    updateInactiveById: async (req, res, next) => {
        try {
            const { catId, status } = req.payload;
                if (!catId || !status) return jsend(400, "Please send valid request data");

               const response= await ExamMainCategory.findOneAndUpdate(
                    {  exa_cat_id: catId } ,
                    { exa_cat_status: status }
                ) .catch((err) => {
                        return jsend(500,err.message);
                    });
                    if(response){
                        return jsend(200, "data updated Successfully")
                    }else{
                        return jsend(500,"Please try again after sometime");
                    }
          
        } catch (error) {
            logger.error(`Error at Update Exam Main Category Status : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 11. Update 'Position'
    updatePositionById: async (req, res, next) => {
        try {
            const {values } = req.payload;
            if (!values)  return jsend(400, "Please send valid request data")
      if (catId== null)  return jsend(400, "Please send valid request data")

                values.forEach(async (val) => {
              await ExamMainCategory.findOneAndUpdate(
                        {exa_cat_id: val.catId } ,
                        { exa_cat_pos: val.position },
                        
                    ); 
                })
                if(!result){
                    return jsend(500, "Please try again after sometime")
                }else{
            return jsend(200,"Update Success !!!",values)
                }
        } catch (error) {
            logger.error(`Error at Update Exam Main Category Position : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 12. Count Only
    getExamMainCount: async (req, res, next) => {
        try {
            const { exa_cat_status } = req.params;
            if (exa_cat_status == null) return jsend(400, "Please send valid request data");
        const  count = await ExamMainCategory.count({
               exa_cat_status:exa_cat_status,
                 examcat_type: {$ne:"S"} 
            }).catch((err) => {
                return jsend(404,err.message);
            });
            return jsend(200,"data received Successfully",{ count});
        } catch (error) {
            logger.error(`Error at Exam Main Category Count : ${error.message}`);
           return jsend(500, error.message)
        }
    },
    // 13. GetHomeMasterCategory
    getHomeMasterCategory: async (req, res, next) => {
        try {
            const { exacatid } = req.params;
            if (!exacatid)  return jsend(400, "Please send valid request data");
            const rows  = await HomeMasterCategory.find({
                    homecategoryid: exacatid
            });

            if (!rows){
                return jsend(404,"Home Exam Master Category Not Found !!!");
        }else{
            const count = rows.length;
         return jsend(200, "data received Successfully",
         { count, mastercategory: rows });
        }
        } catch (error) {
            logger.error(`Error at Get All Home Exam Master Category : ${error.message}`);
            return jsend(500, error.message)
        }
    },
     // 14. GetAllExamChapters
    getAllExamChapters: async (req, res, next) => {
        try {
            const { subId } = req.params;
            if (!subId)  return jsend(400, "Please send valid request data");
            const  rows  = await ExamChapters.find({
                
                    chapter_status: "Y",
                    exa_cat_id: subId,
            }).sort({ chapt_id: 1 });
            if (!rows){ 
                return jsend(404,"Exam sub Category Not Found !!!");
        }else{
            const count = rows.length;
           return jsend(200, "data received Successfully",
           { count, chapters: rows });
        }
        } catch (error) {
            logger.error(`Error at Get All Exam Sub Category : ${error.message}`);
            return jsend(500, error.message)
        }
    },
};