"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose"); 
const moment = serviceLocator.get("moment"); 
const Duration = mongoose.model("tbl__duration");
const ExamPackage = mongoose.model("tbl__exampackage");
const ExamChapters = mongoose.model("tbl__examchapters");
const ExamMainCategory = mongoose.model("tbl__exam_category");
const ExamPackageDuration = mongoose.model("tbl__exampackage_duration");
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
    // 2. Get All Exam Package
    getAllExamPackage: async (req, res, next) => {
        try {
            const { status } = req.params;
      const [category] = await ExamPackage.aggregate([ 
                {$limit:300},                   
                { "$match":{ 
                  package_status:status
                
            }},
                  { '$lookup': {
               'from': "tbl__exam_category",
               'localField': 'master_cat',
               'foreignField': 'exa_cat_id',
               'as': 'ExamData'
             }},                      
              { "$unwind": "$ExamData" },                     
              { '$lookup': {
                'from': "tbl__exam_category",
                'localField': 'main_cat',
                'foreignField': 'exa_cat_id',
                'as': 'ExamChapters'
              }},                     
               { "$unwind": "$ExamChapters" }, 
                 { '$lookup': {
                'from': "tbl__exam_category",
                'localField': 'sub_cat',
                'foreignField': 'exa_cat_id',
                'as': 'ExamCategory'
              }},                     
               { "$unwind": "$ExamCategory" },     
             {$project:{
              mastercategory:"$ExamData.exa_cat_name",
              maincategory:"$ExamChapters.exa_cat_name",
                ExamData:"$ExamData",
                subcategory:"$ExamCategory.exa_cat_name",
                _id:0 ,count:{$sum:1} }}                 
                  ])
       
            if (!category) return jsend(400, "Exam Package Not Found !!!");
            return({ count: category.length, category });
        } catch (error) {
            logger.error(`Error at Get All Exam Package : ${error.message}`);
            return jsend(500, error.message);
        }
    },
    // 3. CreateNewExamPackage
   createNewExamPackage: async (req, res, next) => {
        try {
            console.log(req.payload);
            const { package_name, master_cat, main_cat, sub_cat, selling_price, offer_price } = req.payload;
            if (!package_name || !master_cat || !selling_price || !offer_price)
            return jsend(400, "Please send valid request data")
          const result =  await ExamPackage.create({
                package_name,
                master_cat,
                main_cat,
                sub_cat,
                selling_price,
                offer_price,
                package_status: "Y",
                package_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                package_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            }).catch((err) => {
                return jsend(404,err.message);
            });
            if(result){
                return jsend(200, "data received Successfully",
                { message: "Create Success",result })
            }else{
                return jsend(500, "Please try again after sometime")
            }
    
        } catch (error) {
            logger.error(`Error at Create Exam Package : ${error.message}`);
            return(500,error.message);
        }
    },
    // 4. CreateExamPackage
    createExamPackage: async (req, res, next) => {
        try {
            const { package_name, master_cat, main_cat, sub_cat, chapt_id, duration, selling_price } = req.payload;
            if (!package_name || !master_cat || !selling_price || !duration) 
        return jsend(400, "Please send valid request data");
            
                    // 1. tbl__exampackage insert
                    const exampackage = await ExamPackage.create({
                        package_name,
                        master_cat,
                        main_cat,
                        sub_cat,
                        chapt_id,
                        selling_price,
                        package_status: "Y",
                        package_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        package_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    })
                    console.log(exampackage.package_id);

                    if (master_cat && main_cat == '' && sub_cat == '' && chapt_id == '') {
                        await ExamMainCategory.findOneAndUpdate({ exa_cat_id: master_cat },
                            {
                                payment_flag: 'Y',
                                exa_cat_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            }
                        )
                    }

                    if (master_cat && main_cat && sub_cat == '' && chapt_id == '') {
                      await ExamMainCategory.findOneAndUpdate({ exa_cat_id: main_cat },
                            {
                                payment_flag: 'Y',
                                exa_cat_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            } 
                        )
                    }

                    if (master_cat && main_cat && sub_cat && chapt_id == '') {
                        await ExamMainCategory.findOneAndUpdate({ exa_cat_id: sub_cat },
                            {
                                payment_flag: 'Y',
                                exa_cat_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            } 
                        )
                    }

                    if (master_cat && main_cat && sub_cat && chapt_id) {
                        await ExamChapters.findOneAndUpdate({ chapt_id: chapt_id },
                            {
                                paymentFlag: 'Y',
                                lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            } 
                        )
                    }

                    let packageDurationList = [];
                   duration.forEach((list) => {
                        packageDurationList.push({
                            exam_package_ref_id: exampackage.package_id,
                            duration_ref_id: list.durationId,
                            price: list.price
                        });
                   });
                    console.log(packageDurationList);

                    // 3. tbl__exampackage_duration insert
                await ExamPackageDuration.bulkCreate(packageDurationList);
                 return jsend(200, "data inserted Successfully")
        } catch (error) {
            logger.error(`Error at Create Exam Package : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 5. UpdateExamPackage
    updateExamPackage: async (req, res, next) => {
        try {
            const { package_id } = req.params;
            if (package_id == 0) return jsend(400, "Please send valid data");

    const { package_name, master_cat, main_cat, sub_cat, chapt_id, duration, selling_price } = req.payload;
       if (!package_name || !master_cat || !selling_price || !duration) 
                  return jsend(400, "Please send valid data");
         await ExamPackage.findOneAndUpdate( { package_id: package_id },
                        {
                            package_name,
                            master_cat,
                            main_cat,
                            sub_cat,
                            chapt_id,
                            selling_price,
                            package_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        } )
                    await ExamPackageDuration.destroy({exam_package_ref_id: package_id  })
                    let packageDurationList = [];
                    duration.forEach((list) => {
                        packageDurationList.push({
                            exam_package_ref_id: package_id,
                            duration_ref_id: list.durationId,
                            price: list.price
                        });
                    });
                    // 3. tbl__exampackage_duration insert
                    await ExamPackageDuration.bulkCreate(packageDurationList
                    ).catch((err) => {
                    return jsend(500,err.message);
                });
            return({ message: "Update Success" });
        } catch (error) {
            logger.error(`Error at Update Exam Package : ${error.message}`);
            return jsend(500,error.message);
        }
    },
    // 6. Update 'Active / Inactive / Delete'
    updateStatusById: async (req, res, next) => {
        try {
            const { packageId, status } = req.payload;
            if (!packageId || !status)  return jsend(400, "Please send valid request data");
                  const result =  await ExamPackage.findOneAndUpdate(
                        { package_id: packageId ,
                        package_status: status ,
                        package_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")},
                    )
                 .catch((err) => {
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
    // 7. GetExamDurations
    getExamDurations: async (req, res, next) => {
        try {
            const { package_id } = req.params;
           // if (package_id == 0) throw createError.BadRequest();
      const [durations] = await ExamPackageDuration.aggregate([ 
                {$limit:300},                   
               
                  { '$lookup': {
               'from': "tbl__exampackage",
               'localField': 'exam_package_ref_id',
               'foreignField': 'package_id',
               'as': 'ExamData'
             }},                      
              { "$unwind": "$ExamData" },                     
              { '$lookup': {
                'from': "tbl__duration",
                'localField': 'duration_ref_id',
                'foreignField': 'duration_id',
                'as': 'ExamChapters'
              }},                     
               { "$unwind": "$ExamChapters" }, 
               { "$match":{ 
                "ExamData.package_id":package_id
          }},
             {$project:{
                 price:1,
               id:package_id,
              ExamChapters:"$ExamChapters",
             _id:0 ,count:{$sum:1} }}                 
                  ])
            if (!durations) return jsend(400, "Please send valid request data");
            return({ durations });
        } catch (error) {
            logger.error(`Error at Get All Exam Durations : ${error.message}`);
            return(error);
        }
    },

};
