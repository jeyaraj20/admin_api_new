"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose"); 
const moment = serviceLocator.get("moment"); 
const Exams = mongoose.model("tbl__exam");
const ExamMainCategory = mongoose.model("tbl__exam_category");
const ExamChapters = mongoose.model("tbl__examchapters");
const ExamTypes = mongoose.model("tbl__examtypes");
const Question = mongoose.model("tbl__question");
const Examquestions = mongoose.model("tbl__examquestions");
// const { is_string } = require("locutus/php/var");

module.exports = {
    // 1. Get All Exam Sub Category
    getAllExamSubCategory: async (req, res, next) => {
      try {
          let { status } = req.params;
          
          const result = await ExamMainCategory.find({

              exa_cat_status: status,
              examcat_type: "S",
          })
          const  [category] = await ExamMainCategory.aggregate([
              {
                 "$match": {
                     "exa_cat_status": status,
                  "examcat_type": "S",
                 }
                },
              {
                '$lookup': {
                  'from': "tbl__exam_category",
                  'localField': 'exaid_sub',
                  'foreignField': 'exa_cat_id',
                  'as': 'ExamData'
                }
              },
              { "$unwind": "$ExamData" },
              {
                '$lookup': {
                  'from': "tbl__exam_category",
                  'localField': 'exaid',
                  'foreignField': 'exa_cat_id',
                  'as': 'ExamSrcDetailData'
                }
              },
              { "$unwind": "$ExamSrcDetailData" },
             
              {
                $project: {
                  count: { $sum: 1 },
                  _id:0,
                  Mastercategory:"$ExamSrcDetailData.exa_cat_name",
                  category:"$ExamData.exa_cat_name",
                  }
              }
            ])
              .catch((err) => {
                return jsend(500, error.message);
              });
              
       const  [WaitingCount] = await Exams.aggregate([ 
          {
             "$match": {
                 "exam_type": "C",
                 "exam_status": "W",
             }
            },
          {
            '$lookup': {
              'from': "tbl__exam",
              'localField': 'exa_cat_id',
              'foreignField': 'exam_sub_sub',
              'as': 'ExamData'
            }
          },
          { "$unwind": "$ExamData" },
          {
            $project: {
              _id:0,
              Count: { $sum: 1 },
              count:"$ExamData.exam_id",
              }
          }
        ])
          .catch((err) => {
            return jsend(500, error.message);
          });
          
       const  [ActiveCount] = await Exams.aggregate([
          {
             "$match": {
                 "exam_type": "C",
                 "exam_status": "Y",
             }
            },
          {
            '$lookup': {
              'from': "tbl__exam",
              'localField': 'exa_cat_id',
              'foreignField': 'exam_sub_sub',
              'as': 'ExamData'
            }
          },
          { "$unwind": "$ExamData" },
          {
            $project: {
              _id:0,
              Count: { $sum: 1 },exa_cat_status:1,
              count:"$ExamData.exam_id",
              }
          }
        ])
          .catch((err) => {
            return jsend(500, error.message);
          });
          
      
       const  [bWaitingCount] = await Exams.aggregate([
          {
             "$match": {
                 "exam_type": "B",
                 "exam_status": "W",
             }
            },
          {
            '$lookup': {
              'from': "tbl__exam",
              'localField': 'exa_cat_id',
              'foreignField': 'exam_sub_sub',
              'as': 'ExamData'
            }
          },
          { "$unwind": "$ExamData" },
          {
            $project: {
              _id:0,
              Count: { $sum: 1 },
              count:"$ExamData.exam_id",
              }
          }
        ])
          .catch((err) => {
            return jsend(500, error.message);
          });
          
      
       const  [bActiveCount] = await Exams.aggregate([
          {
             "$match": {
                 "exam_type": "B",
                 "exam_status": "Y",
             }
            },
          {
            '$lookup': {
              'from': "tbl__exam",
              'localField': 'exa_cat_id',
              'foreignField': 'exam_sub_sub',
              'as': 'ExamData'
            }
          },
          { "$unwind": "$ExamData" },
          {
            $project: {
              _id:0,
              Count: { $sum: 1 },
              count:"$ExamData.exam_id",
              }
          }
        ])
          .catch((err) => {
            return jsend(500, err.message);
          });
          
      
      
          if (!result) return jsend(400, "Exam Sub Category Not Found !!!");
          return({
              category,
               WaitingCount ,
               ActiveCount,
               bWaitingCount,
               bActiveCount
              });
      } catch (error) {
          logger.error(`Error at Get All Exam Sub Category : ${error.message}`);
          return(error);
      }
  },
  // 2. GetAllExamSubCategoryChapter
 
    getAllExamSubCategoryChapter: async (req, res, next) => {
        try {
          const { exa_cat_id } = req.params;
            const  rows  = await ExamChapters.find({
               chapter_status: "Y", exa_cat_id: exa_cat_id ,
            }).sort({ chapt_id: 1 });
            if (!rows){
                return jsend(404,"Exam Sub Category Chapter Not Found !!!");
            }else{
           const count = rows.length;
           return jsend(200, "data received Successfully",
           { count, chapterrows: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Exam Sub Category Chapters : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 3. GetAllExamSubCategoryTypes
    getAllExamSubCategoryTypes: async (req, res, next) => {
        try {
          const { exa_cat_id } = req.params;
            const rows  = await ExamTypes.find({
                extype_status: "Y", exa_cat_id: exa_cat_id 
            }).sort({ extype_id: 1 });
            if (!rows) {
                return jsend(500,"Exam Sub Category Type Not Found !!!");
            }else{
            const count = rows.length;
            return jsend(200, "data received Successfully",
            { count, typerows: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Exam Sub Category Types : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 4. Create Exam Sub Category
    createExamSubCategory: async (req, res, next) => {
        try {
      const {exaid, exaid_sub, examcat_type, exa_cat_name, exa_cat_slug,exa_cat_desc,chapterList,
                typeList, payment_flag } = req.payload;
           
                    // 1. tbl__exam_category insert
                    const category = await ExamMainCategory.create({
                        exaid,
                        exaid_sub,
                        examcat_type,
                        exa_cat_name,
                        exa_cat_slug,
                        exa_cat_image: "",
                        exa_cat_desc,
                        exa_cat_pos: "0",
                        exa_cat_status: "Y",
                        exa_cat_dt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        exa_cat_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        payment_flag
                    });
                    console.log(category.exa_cat_id);

                    let examChaptersList = [];
                    let examTypesList = [];
                   chapterList.forEach((list) => {
                        examChaptersList.push({
                            exa_cat_id: category.exa_cat_id,
                            exmain_cat: exaid,
                            exsub_cat: exaid_sub,
                            chapter_name: list,
                            chapter_status: "Y",
                            chapter_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            paymentFlag: 'N'
                        });
                    });
                    console.log(examChaptersList);
                   typeList.forEach((type) => {
                        examTypesList.push({
                            exa_cat_id: category.exa_cat_id,
                            exmain_cat: exaid,
                            exsub_cat: exaid_sub,
                            extest_type: type,
                            extype_status: "Y",
                            extype_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        });
                   });
                    console.log(examTypesList);

                    // 2. tbl__examtypes insert
                    await ExamTypes.create(examTypesList, {
                    });

                    // 3. tbl__examchapters insert
                    await ExamChapters.create(examChaptersList, {
                    })
          
                .catch((err) => {
                    return jsend(400, "Please send valid request data");
                });
            return({ message: "Insert Success" });
        } catch (error) {
            logger.error(`Error at Create Exam Sub Category : ${error.message}`);
            return(error);
        }
    },
    // 5. Get Question By Id
    getExamSubCategoryById: async (req, res, next) => {
        try {
          const { exa_cat_id } = req.params;
            if (exa_cat_id == 0) return jsend(400, "Please send valid request data");

            const [category] = await ExamMainCategory.aggregate([ 
                               
                { "$match":{ 
                  examcat_type:"S",
                  exa_cat_status:"Y",
                  exa_cat_id:exa_cat_id
            }},
                  { '$lookup': {
               'from': "tbl__exam_category",
               'localField': 'exaid_sub',
               'foreignField': 'exa_cat_id',
               'as': 'ExamData'
             }},                      
              { "$unwind": "$ExamData" },                     
              { '$lookup': {
                'from': "tbl__exam_category",
                'localField': 'ExamData.exaid',
                'foreignField': 'exa_cat_id',
                'as': 'ExamChapters'
              }},                     
               { "$unwind": "$ExamChapters" }, 
             {$project:{
                  ExamData:1,
                  Category:"$ExamData.exa_cat_name",
                  "Master category":"$ExamChapters.exa_cat_name",
                  _id:0 ,count:{$sum:1} }}                 
                  ])
            if (!category) {
                return jsend(404,"Exam Sub Category Not Found !!!");
            }else{
                return jsend(200, "data received Successfully",{ category });
            }
        } catch (error) {
            logger.error(`Error at Get Questions By Id : ${error.message}`);
            return(error);
        }
    },
    // 6. Update Question By Id
    updateExamSubCategory: async (req, res, next) => {
        try {
          const { exa_cat_id } = req.params;
            if (exa_cat_id == 0) return jsend(400, "Please send valid request data");

       const {exaid, exaid_sub, examcat_type, exa_cat_name,exa_cat_slug, exa_cat_desc,chapterList, delarr,
             typedelarr, typeList, payment_flag } = req.payload;
          
                    // 1. tbl__exam_category update
          const result  =   await ExamMainCategory.findOneAndUpdate( { exa_cat_id } ,
                        {
                            exaid,
                            exaid_sub,
                            examcat_type,
                            exa_cat_name,
                            exa_cat_slug,
                            exa_cat_image: "",
                            exa_cat_desc,
                            exa_cat_pos: "0",
                            exa_cat_status: "Y",
                            exa_cat_dt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            exa_cat_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            payment_flag
                        },
                     
                    
                    );
                    if (delarr.length > 0) {
                        await ExamChapters.findOneAndUpdate({
                            chapter_status: 'N',  
                            chapt_id: { $in: delarr} 
                            
                        });
                    }
                    if (typedelarr.length > 0) {
                        await ExamTypes.findOneAndUpdate({ 
                            extype_status: 'N' , 
                            extype_id: {$in: typedelarr}
                        });
                    }

                    let examChaptersList = [];
                    let examTypesList = [];
                    for (let chapter of chapterList) {
                        if (chapter.chaptId != '') {
                            examChaptersList.push({
                                chapt_id: chapter.chaptId,
                                exa_cat_id: exa_cat_id,
                                exmain_cat: exaid,
                                exsub_cat: exaid_sub,
                                chapter_name: chapter.name,
                                chapter_status: "Y",
                                chapter_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                paymentFlag: 'N'
                            });
                        } else {
                            examChaptersList.push({
                                exa_cat_id: exa_cat_id,
                                exmain_cat: exaid,
                                exsub_cat: exaid_sub,
                                chapter_name: chapter.name,
                                chapter_status: "Y",
                                chapter_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                paymentFlag: 'N'
                            });
                        }
                    }
                    console.log(examChaptersList);
                   // ExamChapters.bulkCreate(examChaptersList, { updateOnDuplicate: ['chapter_name'] });

                   ExamChapters.create(examChaptersList, { updateOnDuplicate: ['chapter_name'] });
                   
                    
                    for (let type of typeList) {
                        if (type.typeId != '') {
                            examTypesList.push({
                                extype_id: type.typeId,
                                exa_cat_id: exa_cat_id,
                                exmain_cat: exaid,
                                exsub_cat: exaid_sub,
                                extest_type: type.name,
                                extype_status: "Y",
                                extype_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            });
                        } else {
                            examTypesList.push({
                                exa_cat_id: exa_cat_id,
                                exmain_cat: exaid,
                                exsub_cat: exaid_sub,
                                extest_type: type.name,
                                extype_status: "Y",
                                extype_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            })
                           
                        }
                    }
                    console.log(examTypesList);
             //  ExamTypes.bulkCreate(examTypesList, { updateOnDuplicate: ['extest_type'] });
               ExamTypes.create(examTypesList, { updateOnDuplicate: ['extest_type'] });

              // })
                
       if(result){
        return jsend(200, "data received Successfully",
        { message: "Update Success !!!"})
       }else{
        return jsend(500, "Please try again after sometime" )
       }
              
        } catch (error) {
            logger.error(`Error at Update Questions By Id : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 7.  Update 'Active / Inactive / Delete'
    updateStatusById: async (req, res, next) => {
        try {
          const { exa_cat_id, status } = req.payload;
            if (!exa_cat_id || !status)return jsend(400, "Please send valid request data");

                const result  =   await ExamMainCategory.findOneAndUpdate(
                        { exa_cat_status: status },
                       { exa_cat_id: exa_cat_id } ,
                    
              
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
    // 8. Exam Sub Category Search Result
    getSearchResult: async (req, res, next) => {
        try {
            let { searchString, exa_cat_id, status } = req.payload;
            if (!!searchString) searchString = `%${searchString}%`;
            let conditions;
            if (!!searchString && !!exa_cat_id) {
                conditions = `a.exa_cat_name like '${searchString}' AND  a.exaid = '${exa_cat_id}'`;
            } else {
                conditions = `a.exa_cat_name like '${searchString}' OR  a.exaid = '${exa_cat_id}'`;
            }
            
     
      
            const  [category] = await ExamMainCategory.aggregate([
              {
                 "$match": {
                     "exa_cat_status": status,
                  "examcat_type": "S",
                  //conditions:conditions
                 }
                },
              {
                '$lookup': {
                  'from': "tbl__exam_category",
                  'localField': 'exaid_sub',
                  'foreignField': 'exa_cat_id',
                  'as': 'ExamData'
                }
              },
              { "$unwind": "$ExamData" },
              {
                '$lookup': {
                  'from': "tbl__exam_category",
                  'localField': 'exaid',
                  'foreignField': 'exa_cat_id',
                  'as': 'ExamSrcDetailData'
                }
              },
              { "$unwind": "$ExamSrcDetailData" },
             
              {
                $project: {
                  count: { $sum: 1 },
                  Mastercategory:"$ExamSrcDetailData.exa_cat_name",
                  category:"$ExamData.exa_cat_name",
                  }
              }
            ])
              .catch((err) => {
                return jsend(500, error.message);
              });
              
       const  [WaitingCount] = await Exams.aggregate([
          {
             "$match": {
                 "exam_type": "C",
                 "exam_status": "W",
             }
            },
          {
            '$lookup': {
              'from': "tbl__exam",
              'localField': 'exa_cat_id',
              'foreignField': 'exam_sub_sub',
              'as': 'ExamData'
            }
          },
          { "$unwind": "$ExamData" },
          {
            $project: {
              Count: { $sum: 1 },
              count:"$ExamData.exam_id",
              }
          }
        ])
          .catch((err) => {
            return jsend(500, error.message);
          });
          
       const  [ActiveCount] = await Exams.aggregate([
          {
             "$match": {
                 "exam_type": "C",
                 "exam_status": "Y",
             }
            },
          {
            '$lookup': {
              'from': "tbl__exam",
              'localField': 'exa_cat_id',
              'foreignField': 'exam_sub_sub',
              'as': 'ExamData'
            }
          },
          { "$unwind": "$ExamData" },
          {
            $project: {
              Count: { $sum: 1 },exa_cat_status:1,
              count:"$ExamData.exam_id",
              }
          }
        ])
          .catch((err) => {
            return jsend(500, error.message);
          });
          
      
       const  [bWaitingCount] = await Exams.aggregate([
          {
             "$match": {
                 "exam_type": "B",
                 "exam_status": "W",
             }
            },
          {
            '$lookup': {
              'from': "tbl__exam",
              'localField': 'exa_cat_id',
              'foreignField': 'exam_sub_sub',
              'as': 'ExamData'
            }
          },
          { "$unwind": "$ExamData" },
          {
            $project: {
              Count: { $sum: 1 },
              count:"$ExamData.exam_id",
              }
          }
        ])
          .catch((err) => {
            return jsend(500, error.message);
          });
          
      
       const  [bActiveCount] = await Exams.aggregate([
          {
             "$match": {
                 "exam_type": "B",
                 "exam_status": "Y",
             }
            },
          {
            '$lookup': {
              'from': "tbl__exam",
              'localField': 'exa_cat_id',
              'foreignField': 'exam_sub_sub',
              'as': 'ExamData'
            }
          },
          { "$unwind": "$ExamData" },
          {
            $project: {
              Count: { $sum: 1 },
              count:"$ExamData.exam_id",
              }
          }
        ])
           .catch((err) => {
             return jsend(500, err.message);
        });
if (!category) return jsend(400, "Exam Sub Category Not Found !!!");
return({
    categoryCount:category.length,category
    });
} catch (error) {
logger.error(`Error at Get All Exam Sub Category : ${error.message}`);
return(error);
}
    },
    // 9. Get Exam Sub Category Count Only
    getExamSubCount: async (req, res, next) => {
        try {
          const { exa_cat_status } = req.params;
            if (exa_cat_status == null) return jsend(400, "Please send valid request data");
         const   count = await ExamMainCategory.count({
               exa_cat_status, 
               examcat_type: "S",
                exaid_sub: { $ne: 0 } ,
            }).catch((err) => {
                return jsend(500, error.message);
            });
            return jsend(200, "data received Successfully",{ count });
        } catch (error) {
            logger.error(`Error at Get Exam Sub Category Count Only : ${error.message}`);
            return jsend(500, error.message);
        }
    },
    // 10 Exam Sub Category Questions Assign Search Criteria
    questionAssignSearch: async (req, res, next) => {
        try {
          const { pagecount, qType, faculty, searchString,
                exam_id, exam_master_id, exam_cat_id,
                cat_id, sub_id } = req.payload;
            //  if (!!searchString) searchString = `%${searchString}%`;
            if (!pagecount || !exam_id || !exam_master_id || !exam_cat_id) 
            return jsend(400, "Please send valid request data");

            const Exam = await Exams.findOne({
                 exam_id: exam_id ,
            });

            let conditions = ``;

            if (qType != "") {
                conditions = `a.q_type = '${qType}' AND `;
            }
            if (faculty != "") {
                conditions = conditions + `a.quest_add_id = ${faculty} AND `;
            }
            if (searchString != "") {
                conditions = conditions + `a.question LIKE '${searchString}' OR question_code LIKE '${searchString}' AND `;
            }
            if (cat_id != "" && cat_id != 0) {
                conditions = conditions + `a.cat_id = ${cat_id} AND `;
            }
            if (sub_id != "" && sub_id != 0) {
                conditions = conditions + `a.sub_id = ${sub_id} AND `;
            }
            let offset = (pagecount - 1) * 1000;
            const [questions] = await db.sequelize.query(` select a.qid,a.question_code,a.q_type,a.question,a.quest_add_by,a.quest_date,a.quest_level,
        a.quest_status,b.cat_name as 'Category',c.cat_name as 'Subcategory' from tbl__question as a inner join tbl__category as b on a.cat_id= b.cat_id
             inner join tbl__category as c on a.sub_id= c.cat_id 
             where ${conditions} a.quest_level in(${Exam.exam_level}) and  a.quest_status='Y' and a.qid not in
             (select qid from tbl__examquestions where exam_id=? and exam_cat=?
             and exam_subcat=? and exam_queststatus='Y') order by a.qid asc
     limit 1000 OFFSET ${offset}`,
                {
                    replacements: [
                        exam_id,
                        exam_master_id,
                        exam_cat_id
                    ],
                }
            )


            const [questioncount] = await db.sequelize.query(` select count(a.qid) as totalcount from tbl__question as a
             where ${conditions} a.quest_level in(${Exam.exam_level}) and  a.quest_status='Y' 
             and a.qid not in
             (select qid from tbl__examquestions where exam_id=? and exam_cat=?
             and exam_subcat=? and exam_queststatus='Y') `,
                {
                    replacements: [
                        exam_id,
                        exam_master_id,
                        exam_cat_id
                    ],
                }
            )
            

            if (!questions)return jsend(400, "Questions Not Found !!!");
            examQuestionsList = [];
            questions.forEach((row) => {
                examQuestionsList.push(row.qid);
            });

            let questiondata = examQuestionsList.join();
            if (examQuestionsList.length != 0) {
                const [examquestion] = await db.sequelize.query(
                    ` select qid from tbl__examquestions where exam_id!=? 
                and exam_queststatus='Y' and exam_cat=?
                and exam_subcat=? 
                and qid in (`+ questiondata + `)
                group by qid
                `,
                    { replacements: [exam_id, exam_master_id, exam_cat_id ], }
                );
                return({ totalcount: questioncount[0].totalcount, questions, examquestion });
            }
            else {
                let examquestion = [];
                return({ totalcount: questioncount[0].totalcount, questions, examquestion });
            }
        } catch (error) {
            logger.error(`Error at Exam Sub Category Questions Assign Search Criteria : ${error.message}`);
            return jsend(500, error.message)
        }
    },
};
