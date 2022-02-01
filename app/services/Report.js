"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose"); 
const moment = serviceLocator.get("moment"); 
const fs = serviceLocator.get("fs");
const path = serviceLocator.get("path");
const multer = serviceLocator.get("multer");
 const ImageFilter = serviceLocator.get("imageFilter");
const handlebars = serviceLocator.get("handlebars");
const pdf = serviceLocator.get("html-pdf");
const Questions = mongoose.model("tbl__question");
const Exams = mongoose.model("tbl__exam");
const Category = mongoose.model("tbl__category");
const Examquestions = mongoose.model("tbl__examquestions");
const ExamType = mongoose.model("tbl__examtypes");
const Examchapters = mongoose.model("tbl__examchapters");
const ExamMainCategory = mongoose.model("tbl__exam_category");
// const { sort, next } = require("locutus/php/array");
// require("dotenv").config();
// const Reports_html = fs.readFileSync(path.resolve(__dirname, '../templates/reports.html'), 'utf8');
// const template = handlebars.compile(Reports_html);
// const main_html = fs.readFileSync(path.resolve(__dirname, '../templates/maincategory.html'), 'utf8');
// const template2 = handlebars.compile(main_html);
// const test_html = fs.readFileSync(path.resolve(__dirname, '../templates/test.html'), 'utf8');
// const template3 = handlebars.compile(test_html);
// const overall_main_html = fs.readFileSync(path.resolve(__dirname, '../templates/overallmaincategory.html'), 'utf8');
// const template4 = handlebars.compile(overall_main_html);


module.exports = {
    // 1. Get Overall Reports.
    getReportsNew: async (req, res, next) => {
        try {
            const { period, startdate, enddate } = req.payload;

         
            
         const data = await Category.aggregate([ 
                {$limit:300},                   
                { "$match":{  
                  cat_status:"Y"
            }},
                  { '$lookup': {
               'from': "tbl__category",
               'localField': 'cat_id',
               'foreignField': 'pid',
               'as': 'ExamData'
             }},                      
              { "$unwind": "$ExamData" },                     
              { "$match":{  
                "ExamData.cat_status":"Y"
          }},
            
             {$project:{
              Category:"$ExamData.cat_id",
                ExamData:"$ExamData",
                maincategory:"$cat_name",
                subcategory:"$ExamData.cat_name",
                subcategorycode:"$ExamData.cat_code",
                _id:0 ,count:{$sum:1} }}                 
                  ])
              
            const [uploaded] = await Questions.aggregate([ 
                {$limit:300},                   
                { "$match":{  
                 // quest_status:{$ne:"D"},// <> 'D'
                 // quest_date:startdate,
                 // aproved_date:enddate
            }},
            {
              $group: {
                _id: { que: "$sub_id" },
                data: { "$addToSet": "$$ROOT" }
              }
            },
            
             {$project:{
              uploaded:1,
                ExamData:"$data.ExamData",
                Subcategory:"$data.sub_id",
                _id:0 ,count:{$sum:1} }}                 
                  ])
               // console.log(uploaded)
             
            const waiting = await Questions.aggregate([ 
                {$limit:300},                   
                { "$match":{  
                  quest_status:"W",
                //  quest_date:startdate,
                ///  aproved_date:enddate
            }},
            {
              $group: {
                _id: { que: "$sub_id" },
                data: { "$addToSet": "$$ROOT" }
              }
            },
            
             {$project:{
              waiting:1,
                ExamData:"$data.ExamData",
                Subcategory:"$sub_id",
                _id:0 ,count:{$sum:1} }}                 
                  ])
               
          const [active] = await Questions.aggregate([ 
                {$limit:300},                   
                { "$match":{  
                  quest_status:"Y",
               //   quest_date:startdate,
                 // aproved_date:enddate
            }},
            {
              $group: {
                _id: { que: "$sub_id" },
                data: { "$addToSet": "$$ROOT" }
              }
            },
            
             {$project:{
              active:1,
                ExamData:"$data.ExamData",
                Subcategory:"$sub_id",
                _id:0 ,count:{$sum:1} }}                 
                  ])
                 //console.log(active)
             
         const [inactive] = await Questions.aggregate([ 
                {$limit:300},                   
                { "$match":{  
                  quest_status:"N",
                 // quest_date:startdate,
                 // aproved_date:enddate
            }},
            {
              $group: {
                _id: { que: "$sub_id" },
                data: { "$addToSet": "$$ROOT" }
              }
            },
            
             {$project:{
              inactive:1,
                ExamData:"$data,ExamData",
                Subcategory:"$sub_id",
                _id:0 ,count:{$sum:1} }}                 
                  ])
                 console.log(inactive)
              

            let finalArr = [];
            for (let category of data) {
                let uploadedArr = uploaded.filter(e => e.sub_id == category.cat_id)
                let waitingArr = waiting.filter(e => e.sub_id == category.cat_id)
                let activeArr = active.filter(e => e.sub_id == category.cat_id)
                let inactiveArr = inactive.filter(e => e.sub_id == category.cat_id)

                let uploadedCount;
                let waitingCount;
                let activeCount;
                let inactiveCount;

                if (uploadedArr.length != 0) {
                    uploadedCount = uploadedArr[0].uploaded;
                } else {
                    uploadedCount = 0;
                }
                if (waitingArr.length != 0) {
                    waitingCount = waitingArr[0].waiting
                } else {
                    waitingCount = 0;
                }
                if (activeArr.length != 0) {
                    activeCount = activeArr[0].active
                } else {
                    activeCount = 0;
                }
                if (inactiveArr.length != 0) {
                    inactiveCount = inactiveArr[0].inactive
                } else {
                    inactiveCount = 0;
                }

                if (uploadedArr.length != 0 || waitingArr.length != 0 || activeArr.length != 0 || inactiveArr.length != 0) {
                    finalArr.push({
                        maincategory: category.maincategory,
                        subcategory: category.subcategory,
                        subcategorycode: category.subcategorycode,
                        uploaded: uploadedCount,
                        waiting: waitingCount,
                        active: activeCount,
                        inactive: inactiveCount
                    });
                }

            }

            console.log(finalArr);
            const html = template({ data: finalArr });

            console.log(__dirname);

            

            pdf.create(html).toFile(path.join(__dirname, './report.pdf'), function (err, data1) {
                if (err) {
                    console.log(err);
                    return({ statusCode: 201, message: 'Create pdf failed.' });
                } else {
                    fs.readFile(path.join(__dirname, './report.pdf'), function (err, data2) {
                        res.header('Content-Type', 'application/pdf');
                        req.header('Content-Transfer-Encoding', 'Binary');
                        res.header('Content-Disposition', 'attachment; filename="' + 'download-' + Date.now() + '.pdf"');
                        return(data2);
                    });
                }
            });

        } catch (error) {
            return jsend(500,error.message);
        }
    },
    // 2. GetReports
    getReports: async (req, res, next) => {
        try {
            const {  period, startdate, enddate  } = req.payload;
            //if (!period) return jsend(400, "Please send valid request data");
                       // remove limit 10
            const  [data] = await Category .aggregate([
                {
                  "$match": {
                    cat_status:"Y"
                  }
                       }, 
                       {
                        '$lookup': {
                            'from': "tbl__category",
                            'localField': 'cat_id',
                            'foreignField': 'pid',
                            'as': 'ExamData'
                          }
                         },
                      { "$unwind": "$ExamData" },
                      {
                       "$match": {
                   "ExamData.cat_status":"Y"
                  }  
                },  
               {
                 $project: {
                   cat_id:"$ExamData.cat_id",subcategorycode:"$ExamData.cat_code",maincategory:cat_name,
                   subcategory:"$ExamData.cat_name",count: { $sum: 1 }
                   }
               }
             ])

            // remove limit 10
            const  datas = await Category .aggregate([
                {
                  "$match": {
                    cat_status:"Y"
                  }
                       }, 
                       {
                        '$lookup': {
                            'from': "tbl__category",
                            'localField': 'cat_id',
                            'foreignField': 'pid',
                            'as': 'ExamData'
                          }
                         },
                      { "$unwind": "$ExamData" },
                      {
                       "$match": {
                   "ExamData.cat_status":"Y"
                  }  
                },  
               {
                 $project: {
                   cat_id:"$ExamData.cat_id",subcategorycode:"$ExamData.cat_code",maincategory:cat_name,
                   subcategory:"$ExamData.cat_name",count: { $sum: 1 }
                   }
               }
             ])

            // let [uploaded] = await db.sequelize.query(
            //     `select count(*) as uploaded, que.sub_id from tbl__question as que where que.quest_status <> 'D' and que.quest_date BETWEEN '` + startdate + ` 00:00:00' and '` + enddate + ` 23:59:59' GROUP BY que.sub_id`
            // );
            const  [uploaded] = await Questions .aggregate([
                {
                  "$match": {
                    quest_status:{$ne:"D"},
                    quest_date:startdate,
                    enddate:enddate
                  }
                       }, 
                         {
                          "$group": {
                                   "_id": "$sub_id",
                                  "data": { "$addToSet": "$$ROOT" }
                                       }
                                   },
               {
                 $project: {
                   sub_id:"$data.sub_id",uploaded: { $sum: 1 }
                   }
               }
             ])
         
            const  [waiting] = await Questions .aggregate([
                {
                  "$match": {
                    quest_status:"W",
                    quest_date:startdate,
                    enddate:enddate
                  }
                  }, 
                   {
                     "$group": {
                            "_id": "$sub_id",
                            "data": { "$addToSet": "$$ROOT" }
                  }
                },
               {
                 $project: {
                   sub_id:"$data.sub_id",waiting: { $sum: 1 }
                   }
               }
             ])
           
            const  [active] = await Questions .aggregate([
                {
                  "$match": {
                    quest_status:"Y",
                    quest_date:startdate,
                    enddate:enddate
                  }
                 }, 
                  {
                  "$group": {
                           "_id": "$sub_id",
                           "data": { "$addToSet": "$$ROOT" }
                    }
                  },
                      
               {
                 $project: {
                   sub_id:"$data.sub_id",active: { $sum: 1 }
                   }
               }
             ])
          
            const  [inactive] = await Questions .aggregate([
                {
                  "$match": {
                    quest_status:"N",
                    quest_date:startdate,
                    enddate:enddate
                  }
                       }, 
                         {
                          "$group": {
                                   "_id": "$sub_id",
                                  "data": { "$addToSet": "$$ROOT" }
                                       }
                                   },
                      
               {
                 $project: {
                   sub_id:"$data.sub_id",inactive: { $sum: 1 }
                   }
               }
             ])

            let finalArr = [];
            for (let category of data) {
                let uploadedArr = uploaded.filter(e => e.sub_id == category.cat_id)
                let waitingArr = waiting.filter(e => e.sub_id == category.cat_id)
                let activeArr = active.filter(e => e.sub_id == category.cat_id)
                let inactiveArr = inactive.filter(e => e.sub_id == category.cat_id)

                let uploadedCount;
                let waitingCount;
                let activeCount;
                let inactiveCount;

                if (uploadedArr.length != 0) {
                    uploadedCount = uploadedArr[0].uploaded;
                } else {
                    uploadedCount = 0;
                }
                if (waitingArr.length != 0) {
                    waitingCount = waitingArr[0].waiting
                } else {
                    waitingCount = 0;
                }
                if (activeArr.length != 0) {
                    activeCount = activeArr[0].active
                } else {
                    activeCount = 0;
                }
                if (inactiveArr.length != 0) {
                    inactiveCount = inactiveArr[0].inactive
                } else {
                    inactiveCount = 0;
                }

                if (uploadedArr.length != 0 || waitingArr.length != 0 || activeArr.length != 0 || inactiveArr.length != 0) {
                    finalArr.push({
                        maincategory: category.maincategory,
                        subcategory: category.subcategory,
                        subcategorycode: category.subcategorycode,
                        uploaded: uploadedCount,
                        waiting: waitingCount,
                        active: activeCount,
                        inactive: inactiveCount
                    });
                }

            }

            //console.log(data);
            //let { processeddata } = await getOverallData(data, startdate, enddate);
            //console.log(processeddata);
            return jsend(200,{
                count: data.length,
                qdata: finalArr
            });

        } catch (error) {
            return jsend(500,error.message);
        }
    },
    // 3. GetMainReportsNew
    getMainReportsNew: async (req, res, next) => {
        try {
            const {  period, startdate, enddate } = req.payload;
            const  categories = await Category .aggregate([
                        {
                         "$match": {
                            "enddate": enddate,
                            "quest_date": startdate,
                                cat_status:{$ne:"D"},
                                       pid:"0"
                                  }
                                    }
                               ])  
          const  waiting = await Questions .aggregate([
        {
           "$match": {
               "enddate": enddate,
               "quest_date": startdate,
               exam_status:{$ne:"D"},
               quest_status:"W"
           }
          },
                  { '$lookup': {
               'from': "tbl__category",
               'localField': 'cat_id',
               'foreignField': 'cat_id',
               'as': 'ExamData'
             }},                      
              { "$unwind": "$ExamData" }, 
                  {
                    "$group": {
                        "_id":"$ExamData.cat_id",
                        "data": { "$addToSet": "$$ROOT" }
                    }
                },  
        {
          $project: {
            cat_id: { $sum: 1 },
            cat_id:"$ExamData.cat_id",cat_name:"$ExamData.cat_name"
            }
        }
      ])
             const  active = await Questions .aggregate([
        {
           "$match": {
               "enddate": enddate,
               "quest_date": startdate,
               quest_status:"Y"
           }
          },
                  { '$lookup': {
               'from': "tbl__category",
               'localField': 'cat_id',
               'foreignField': 'cat_id',
               'as': 'ExamData'
             }},                      
              { "$unwind": "$ExamData" }, 
                  {
                    "$group": {
                        "_id":"$ExamData.cat_id",
                        "data": { "$addToSet": "$$ROOT" }
                    }
                },  
        {
          $project: {
            active: { $sum: 1 },
            cat_id:"$ExamData.cat_id",cat_name:"$ExamData.cat_name"
            }
        }
      ])
                const  inactive = await Questions .aggregate([
        {
           "$match": {
               "enddate": enddate,
               "quest_date": startdate,
               quest_status:"N"
           }
          },
                  { '$lookup': {
               'from': "tbl__category",
               'localField': 'cat_id',
               'foreignField': 'cat_id',
               'as': 'ExamData'
             }},                      
              { "$unwind": "$ExamData" }, 
                  {
                    "$group": {
                        "_id":"$ExamData.cat_id",
                        "data": { "$addToSet": "$$ROOT" }
                    }
                },  
        {
          $project: {
            inactive: { $sum: 1 },
            cat_id:"$ExamData.cat_id",cat_name:"$ExamData.cat_name"
            }
        }
      ])
                 const  totalquestion = await Questions .aggregate([
    {
       "$match": {
           "pid":"0",
           "enddate": enddate,
           "quest_date": startdate,
           quest_status:{$ne:"D"}
       }
      },
              { '$lookup': {
           'from': "tbl__category",
           'localField': 'cat_id',
           'foreignField': 'cat_id',
           'as': 'ExamData'
         }},                      
          { "$unwind": "$ExamData" }, 
              {
                "$group": {
                    "_id":"$ExamData.cat_id",
                    "data": { "$addToSet": "$$ROOT" }
                }
            },  
    {
      $project: {
        total: { $sum: 1 },
        cat_id:"$ExamData.cat_id",cat_name:"$ExamData.cat_name"
        }
    }
  ])
            let finalArr = [];
            for (let category of categories) {
                let waitingArr = waiting.filter(e => e.cat_id == category.cat_id)
                let activeArr = active.filter(e => e.cat_id == category.cat_id)
                let inactiveArr = inactive.filter(e => e.cat_id == category.cat_id)
                let totalArr = totalquestion.filter(e => e.cat_id == category.cat_id)

                let waitingCount;
                let activeCount;
                let inactiveCount;
                let totalCount;
                if (waitingArr.length != 0) {
                    waitingCount = waitingArr[0].waiting
                } else {
                    waitingCount = 0;
                }
                if (activeArr.length != 0) {
                    activeCount = activeArr[0].active
                } else {
                    activeCount = 0;
                }
                if (inactiveArr.length != 0) {
                    inactiveCount = inactiveArr[0].inactive
                } else {
                    inactiveCount = 0;
                }
                if (totalArr.length != 0) {
                    totalCount = totalArr[0].total
                } else {
                    totalCount = 0;
                }
                if (totalArr.length != 0 || waitingArr.length != 0 || activeArr.length != 0 || inactiveArr.length != 0) {
                    finalArr.push({
                        categoryname: category.cat_name,
                        waiting: waitingCount,
                        active: activeCount,
                        inactive: inactiveCount,
                        total: totalCount
                    });
                }
            }
            console.log(finalArr);

            /*res.send({
                data: finalArr
            });*/

           // const html = template2({ data: finalArr });            

           // pdf.create(html).toFile(path.join(__dirname, './report.pdf'), function (err, data1){
                if (!err) {
                    console.log(err);
                    return({ statusCode: 201, message: 'Create pdf failed.'},err.message );
                } else {
                  //  fs.readFile(path.join(__dirname, './report.pdf'), function (err, data2) {
                        res.header('Content-Type', 'application/pdf');
                        req.header('Content-Transfer-Encoding', 'Binary');
                        res.header('Content-Disposition', 'attachment; filename="' + 'download-' + Date.now() + '.pdf"');
                        return(data2);
                 //   });
                }
          //  });

        } catch (error) {
            return jsend(500,error.message);
        }
    },
    // 4.GetMainReports
    getMainReports: async (req, res, next) => {
        try {
            const {period, startdate, enddate } = req.payload;
            
            const categories = await Category.aggregate([ 
                {$limit:300},                   
                { "$match":{  
                 //   pid:"0",
                   // cat_status:{$ne:"D"}
            }},
            {
                "$group": {
                    "_id": "$ExamData.cat_id",
                    "data": { "$addToSet": "$$ROOT" }
                }
            },
            {$project:{
                cat_id:"$data.ExamData.cat_id",
                cat_name:"$data.ExamData.cat_name",
                  _id:0 ,count:{$sum:1} }}  
                         
        ])
        .catch((err) => {
            return jsend(404,err.message);
        });
       

            
  const waiting = await Questions.aggregate([ 
                {$limit:300},                   
                { "$match":{  
                // pid:"0",
               // quest_status:"W",
               //quest_date:startdate,
                // aproved_date:enddate
            }},
            {
              '$lookup': {
                'from': "tbl__category",
                'localField': 'cat_id',
                'foreignField': 'cat_id',
                'as': 'ExamData'
              }
            },
            { "$unwind": "$ExamData" },
            {
                "$group": {
                    "_id": "$ExamData.cat_id",
                    "data": { "$addToSet": "$$ROOT" }
                }
            },
           
             {$project:{
              catname:"$data.ExamData.cat_name",
              catId:"$data.ExamData.cat_id",
                _id:0 ,count:{$sum:1} }}                 
                  ])
                .catch((err) => {
                    return jsend(404,err.message);
                });
             
         
            const active = await Questions.aggregate([ 
                {$limit:300},                   
                { "$match":{  
                //  pid:"0",
                 // quest_status:"Y",
                  //quest_date:startdate,
                 // aproved_date:  enddate
            }},
            {
              '$lookup': {
                'from': "tbl__category",
                'localField': 'cat_id',
                'foreignField': 'cat_id',
                'as': 'ExamData'
              }
            },
            { "$unwind": "$ExamData" },
            {
              "$group": {
                  "_id": "$ExamData.cat_id",
                  "data": { "$addToSet": "$$ROOT" }
              }
          },
           
             {$project:{
            
              catname:"$data.ExamData.cat_name",
              catId:"$data.ExamData.cat_id",
                _id:0 ,count:{$sum:1} }}                 
                  ])
                .catch((err) => {
                    return jsend(404,err.message);
                });
               
         

const inactive = await Questions.aggregate([ 
                {$limit:300},                   
                { "$match":{  
                 // pid:"0",
                  //quest_status:"N",
                  //quest_date:startdate,
                 // aproved_date:  enddate
            }},
            {
              '$lookup': {
                'from': "tbl__category",
                'localField': 'cat_id',
                'foreignField': 'cat_id',
                'as': 'ExamData'
              }
            },
            { "$unwind": "$ExamData" },
            {
              "$group": {
                  "_id": "$ExamData.cat_id",
                  "data": { "$addToSet": "$$ROOT" }
              }
          },
           
             {$project:{
              inactive:1,
              catname:"$data.ExamData.cat_name",
              catId:"$data.ExamData.cat_id",
                _id:0 ,count:{$sum:1} }}                 
                  ])
                .catch((err) => {
                    return jsend(404,err.message);
                });
                console.log(inactive)
         
            
const totalquestion = await Questions.aggregate([ 
                {$limit:300},                   
                { "$match":{  
                  pid:"0",
                  quest_status:{$ne:"D"},//!= 'D'
                  quest_date:startdate,
                  aproved_date:  enddate
            }},
            {
              '$lookup': {
                'from': "tbl__category",
                'localField': 'cat_id',
                'foreignField': 'cat_id',
                'as': 'ExamData'
              }
            },
            { "$unwind": "$ExamData" },
            {
              "$group": {
                  "_id": "$ExamData.cat_id",
                  "data": { "$addToSet": "$$ROOT" }
              }
          },
           
             {$project:{
              inactive:1,
              catname:"$data.ExamData.cat_name",
              catId:"$data.ExamData.cat_id",
                _id:0 ,count:{$sum:1} }}                 
                  ])
                .catch((err) => {
                    return jsend(404,err.message);
                });

            let finalArr = [];
            for (let category of categories) {
                let waitingArr = waiting.filter(e => e.cat_id == category.cat_id)
                let activeArr = active.filter(e => e.cat_id == category.cat_id)
                let inactiveArr = inactive.filter(e => e.cat_id == category.cat_id)
                let totalArr = totalquestion.filter(e => e.cat_id == category.cat_id)

                let waitingCount;
                let activeCount;
                let inactiveCount;
                let totalCount;
                if (waitingArr.length != 0) {
                    waitingCount = waitingArr[0].waiting
                } else {
                    waitingCount = 0;
                }
                if (activeArr.length != 0) {
                    activeCount = activeArr[0].active
                } else {
                    activeCount = 0;
                }
                if (inactiveArr.length != 0) {
                    inactiveCount = inactiveArr[0].inactive
                } else {
                    inactiveCount = 0;
                }
                if (totalArr.length != 0) {
                    totalCount = totalArr[0].total
                } else {
                    totalCount = 0;
                }
                if (totalArr.length != 0 || waitingArr.length != 0 || activeArr.length != 0 || inactiveArr.length != 0) {
                    finalArr.push({
                        categoryname: category.cat_name,
                        waiting: waitingCount,
                        active: activeCount,
                        inactive: inactiveCount,
                        total: totalCount
                    });
                }
            }
     if (!finalArr) {
                return jsend(500,"Exam Not Found !!!");
            }else{
            const count = finalArr.length;
           return jsend(200, "data received Successfully",
           { count, finalArr});
            }
        } catch (error) {
            logger.error(`Error at Get All Exam By Status : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 5. GetTestReportsNew
    getTestReportsNew: async (req, res, next) => {
     try {
     const { period,startdate, enddate } = req.payload;
      const datas = await Exams.aggregate([
        {
          "$match": {
            exam_sub_sub: {$ne:"D"},
            exam_date:startdate,//startdate
            enddate:enddate//23:59:59
          }
        },
        {
          '$lookup': {
            'from': "tbl__exam_category",
            'localField': 'exam_sub_sub',
            'foreignField': 'exa_cat_id',
            'as': 'ExamData'
          }
        },
        { "$unwind": "$ExamData" },
        {
          '$lookup': {
            'from': "tbl__exam_category",
            'localField': 'exaid_sub',
            'foreignField': 'exa_cat_id',
            'as': 'ExamSrcDetailData'
          }
        },
        { "$unwind": "$ExamSrcDetailData" },
        {
          '$lookup': {
            'from': "tbl__exam_category",
            'localField': 'exaid',
            'foreignField': 'exa_cat_id',
            'as': 'ExamDetail'
          }
        },
        { "$unwind": "$ExamDetail" },
        {
          $project: {
            count: { $sum: 1 },
            mastercategory:"$ExamDetail.exa_cat_name",
            maincategory:"$ExamSrcDetailData.exa_cat_name",
            Subcategory:"$ExamData.exa_cat_name",
            examname:"exam_name",examcode:"exam_code",examques:"tot_questions",staffname:"exam_add_name",
            examdate:"exam_date",examcat:"exam_type_cat",examptype:"exam_type_id"
          }
        }

      ])
        .catch((err) => {
          return jsend(500, error.message);
        });      
             const examtypename1 = await Examchapters.aggregate([
   
                    {
                           "$group": {
                                   "_id": "$chapt_id",
                                  "data": { "$addToSet": "$$ROOT" }
                            }
                        },    
                     {
                           $project: {
                                examname:"data.chapter_name",chapt_id:1
                                }}
])
            const examtypename2 = await ExamType.aggregate([
   
                {
                       "$group": {
                               "_id": "$extype_id",
                              "data": { "$addToSet": "$$ROOT" }
                        }
                    },    
                 {
                       $project: {
                            examname:"data.extest_type",extype_id:1
                            }}


])

            let finalArr = [];
            for (let category of datas) {
                let examtypename = [];
                if (category.examcat == 'C') {
                    examtypename = examtypename1.filter(e => e.chapt_id == category.examptype)
                }
                if (category.examcat == 'T') {
                    examtypename = examtypename2.filter(e => e.extype_id == category.examptype)
                }
                let examtypenameCount;
                if (examtypename.length != 0) {
                    examtypenameCount = examtypename[0].examname
                } else {
                    examtypenameCount = 0;
                }
                finalArr.push({
                    mastercategory: category.mastercategory,
                    maincategory: category.maincategory,
                    subcategory: category.subcategory,
                    examname: category.examname,
                    examcode: category.examcode,
                    examques: category.examques,
                    staffname: category.staffname,
                    examdate: moment(new Date(category.examdate)).format("DD-MM-YYYY HH:mm:ss"),
                    examtypename: examtypenameCount
                });
            }
            if (!finalArr) {
                return jsend(500,"Exam Not Found !!!");
            }else{
            const count = finalArr.length;
           return jsend(200, "data received Successfully",
           { count, finalArr});
            }
        } catch (error) {
            logger.error(`Error at Get All Exam By Status : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 6. GetTestReports
    getTestReports: async (req, res, next) => {
        try {
         const { period, startdate, enddate } = req.payload;

 const data = await Exams.aggregate([
        {
          "$match": {
            exam_status: {$ne:"D"},
            exam_date:startdate,//startdate
            enddate:enddate//23:59:59
          }
        },
        {
          '$lookup': {
            'from': "tbl__exam_category",
            'localField': 'exam_sub_sub',
            'foreignField': 'exa_cat_id',
            'as': 'ExamData'
          }
        },
        { "$unwind": "$ExamData" },
        {
          '$lookup': {
            'from': "tbl__exam_category",
            'localField': 'exaid_sub',
            'foreignField': 'exa_cat_id',
            'as': 'ExamSrcDetailData'
          }
        },
        { "$unwind": "$ExamSrcDetailData" },
        {
          '$lookup': {
            'from': "tbl__exam_category",
            'localField': 'exaid',
            'foreignField': 'exa_cat_id',
            'as': 'ExamDetail'
          }
        },
        { "$unwind": "$ExamDetail" },
        {
          $project: {
            count: { $sum: 1 },
            mastercategory:"$ExamDetail.exa_cat_name",
            maincategory:"$ExamSrcDetailData.exa_cat_name",
            Subcategory: "$ExamData.exa_cat_name",
            examname:"exam_name",examcode:"exam_code",examques:"tot_questions",staffname:"exam_add_name",
            examdate:"exam_date",examcat:"exam_type_cat",examptype:"exam_type_id"
          }
        }
      ])
        .catch((err) => {
          return jsend(500, error.message);
        });
            const examtypename1 = await Examchapters.aggregate([
   
                {
                       "$group": {
                               "_id": "$chapt_id",
                              "data": { "$addToSet": "$$ROOT" }
                        }
                    },    
                 {
                       $project: {
                            examname:"data.chapter_name",chapt_id:1
                            }}
])
            const examtypename2 = await ExamType.aggregate([
   
                {
                       "$group": {
                               "_id": "$extype_id",
                              "data": { "$addToSet": "$$ROOT" }
                        }
                    },    
                 {
                       $project: {
                            examname:"data.extest_type",extype_id:1
                            }}


])
            let finalArr = [];
            for (let category of data) {
                let examtypename = [];
                if (category.examcat == 'C') {
                    examtypename = examtypename1.filter(e => e.chapt_id == category.examptype)
                }
                if (category.examcat == 'T') {
                    examtypename = examtypename2.filter(e => e.extype_id == category.examptype)
                }
                let examtypenameCount;
                if (examtypename.length != 0) {
                    examtypenameCount = examtypename[0].examname
                } else {
                    examtypenameCount = 0;
                }
                finalArr.push({
                    mastercategory: category.mastercategory,
                    maincategory: category.maincategory,
                    subcategory: category.subcategory,
                    examname: category.examname,
                    examcode: category.examcode,
                    examques: category.examques,
                    staffname: category.staffname,
                    examdate: new Date(category.examdate),
                    examtypename: examtypenameCount
                });
            }

            //let { processeddata } = await getTestData(data, startdate, enddate);
            return({
                count: data.length,
                qdata: finalArr
            });

        } catch (error) {
            return(error);
        }
    },
    // 7. GetOverallMastersNew
    getOverallMastersNew: async (req, res, next) => {
        try {
            const { period,startdate,enddate} = req.payload;
                const data= ExamMainCategory.aggregate([
                { '$lookup': {
                    'from': "tbl__exam_category",
                    'localField': 'exaid_sub',
                    'foreignField': 'exa_cat_id',
                    'as': 'ec2'
                  }},
                  { "$unwind": "$ec2" },                     
                  { '$lookup': {
                    'from': "tbl__exam_category",
                    'localField': 'exa_cat_id',
                    'foreignField': 'exaid',
                    'as': 'ec3'
                  }},        
                  { "$unwind": "$ec3" },  
                  {
                    $group: {
          
                      _id: { mastercategory: "$ec3.exa_cat_name", maincategory: "$ec2.exa_cat_name",subcategory:"$exa_cat_name" },
                      sub_id: { $first: "$exa_cat_id" },
                      mainid:{ $first: "$ec2.exa_cat_id"},
                      masterid:{$first: "$ec3.exa_cat_id"}

                    }
                  }    
            ])
            
            const  [totalquestions] = await Exams .aggregate([
                {
                  "$match": {
                      exam_status:{ne:"D"},
                      exam_date:startdate,
                      enddate:enddate
                  }
                       }, 
                        { '$lookup': {
                 'from': "tbl__exam",
                 'localField': 'exam_id',
                 'foreignField': 'exam_id',
                 'as': 'ExamData'
               }},                      
                { "$unwind": "$ExamData" },
                      {
                 $group: {
                   _id: { name1: "$ExamData.exam_cat", name2: "$ExamDatas.exam_sub",name3:"$ExamDatas.exam_sub_sub" },
                   data: { "$addToSet": "$$ROOT" }
                 }
               },    
               {
                 $project: {
                   exam_cat:"$data.ExamData.exam_cat",exam_sub:"$data.ExamData.exam_sub",
                   exam_sub_sub:"$data.ExamData.exam_sub_sub",totalquestions: { $sum: 1 },
                   }
               }
             ])
            const  [topicwisereports] = await Exams .aggregate([
                {
                  "$match": {
                    exam_type_cat:"C",
                      exam_status:{ne:"D"},
                      exam_date:startdate,
                      enddate:enddate
                  }
                       }, 
                      {
                 $group: {
                   _id: { name1: "$exam_cat", name2: "$exam_sub",name3:"$exam_sub_sub" },
                   data: { "$addToSet": "$$ROOT" }
                 }
               },    
               {
                 $project: {
                   exam_cat:"$data.exam_cat",exam_sub:"$data.exam_sub",
                   exam_sub_sub:"$data.exam_sub_sub",topicwisereports: { $sum: 1 },
                   }
               }
             ])
             
        const  [fulltests] = await Exams .aggregate([
         {
           "$match": {
             exam_type_cat:"B",
               exam_status:{ne:"D"},
               exam_date:startdate,
               enddate:enddate
           }
                }, 
               {
          $group: {
            _id: { name1: "$exam_cat", name2: "$exam_sub",name3:"$exam_sub_sub" },
            data: { "$addToSet": "$$ROOT" }
          }
        },    
        {
          $project: {
            exam_cat:"$data.exam_cat",exam_sub:"$data.exam_sub",
            exam_sub_sub:"$data.exam_sub_sub",fulltests: { $sum: 1 },
            }
        }
      ])
            const  [secsubject] = await Exams .aggregate([
                {
                  "$match": {
                    sect_cutoff:"Y",
                      exam_status:{ne:"D"},
                      exam_date:startdate,
                      enddate:enddate
                  }
                       }, 
                      {
                 $group: {
                   _id: { name1: "$exam_cat", name2: "$exam_sub",name3:"$exam_sub_sub" },
                   data: { "$addToSet": "$$ROOT" }
                 }
               },    
               {
                 $project: {
                   exam_cat:"$data.exam_cat",exam_sub:"$data.exam_sub",
                   exam_sub_sub:"$data.exam_sub_sub",secsubject: { $sum: 1 },
                   }
               }
             ])
            const  [sectiming] = await Exams .aggregate([
                {
                  "$match": {
                    sect_timing:"Y",
                      exam_status:{ne:"D"},
                      exam_date:startdate,
                      enddate:enddate
                  }
                       }, 
                      {
                 $group: {
                   _id: { name1: "$exam_cat", name2: "$exam_sub",name3:"$exam_sub_sub" },
                   data: { "$addToSet": "$$ROOT" }
                 }
               },    
               {
                 $project: {
                   exam_cat:"$data.exam_cat",exam_sub:"$data.exam_sub",
                   exam_sub_sub:"$data.exam_sub_sub",sectiming: { $sum: 1 },
                   }
               }
             ])

            let finalArr = [];
            for (let category of data) {
                let totalquestionsArr = totalquestions.filter(e => (e.exam_cat == category.masterid && e.exam_sub == category.mainid && e.exam_sub_sub == category.subid))
                let topicwisereportsArr = topicwisereports.filter(e => (e.exam_cat == category.masterid && e.exam_sub == category.mainid && e.exam_sub_sub == category.subid))
                let fulltestsArr = fulltests.filter(e => (e.exam_cat == category.masterid && e.exam_sub == category.mainid && e.exam_sub_sub == category.subid))
                let secsubjectArr = secsubject.filter(e => (e.exam_cat == category.masterid && e.exam_sub == category.mainid && e.exam_sub_sub == category.subid))
                let sectimingArr = sectiming.filter(e => (e.exam_cat == category.masterid && e.exam_sub == category.mainid && e.exam_sub_sub == category.subid))

                let totalquestionsCount;
                let topicwisereportsCount;
                let fulltestsCount;
                let secsubjectCount;
                let sectimingCount;
                if (totalquestionsArr.length != 0) {
                    totalquestionsCount = totalquestionsArr[0].totalquestions
                } else {
                    totalquestionsCount = 0;
                }
                if (topicwisereportsArr.length != 0) {
                    topicwisereportsCount = topicwisereportsArr[0].topicwisereports
                } else {
                    topicwisereportsCount = 0;
                }
                if (fulltestsArr.length != 0) {
                    fulltestsCount = fulltestsArr[0].fulltests
                } else {
                    fulltestsCount = 0;
                }
                if (secsubjectArr.length != 0) {
                    secsubjectCount = secsubjectArr[0].secsubject
                } else {
                    secsubjectCount = 0;
                }
                if (sectimingArr.length != 0) {
                    sectimingCount = sectimingArr[0].sectiming
                } else {
                    sectimingCount = 0;
                }
                //console.log(waitingCount);
                if (totalquestionsArr.length != 0 || topicwisereportsArr.length != 0 || fulltestsArr.length != 0 || secsubjectArr.length != 0 || sectimingArr.length != 0) {
                    finalArr.push({
                        mastercategory: category.mastercategory,
                        maincategory: category.maincategory,
                        subcategory: category.subcategory,
                        totalquestions: totalquestionsCount,
                        topicwisereports: topicwisereportsCount,
                        fulltests: fulltestsCount,
                        secsubject: secsubjectCount,
                        sectiming: sectimingCount
                    });
                }
            }
            //let { processeddata } = await getOverallmasterData(data, startdate, enddate);
            const html = template4({ data: finalArr });            

            pdf.create(html).toFile(path.join(__dirname, './report.pdf'), function (err, data1) {
                if (err) {
                    console.log(err);
                    return({ statusCode: 201, message: 'Create pdf failed.' });
                } else {
                    fs.readFile(path.join(__dirname, './report.pdf'), function (err, data2) {
                        res.header('Content-Type', 'application/pdf');
                        req.header('Content-Transfer-Encoding', 'Binary');
                        res.header('Content-Disposition', 'attachment; filename="' + 'download-' + Date.now() + '.pdf"');
                        return jsend(200,data2);
                    });
                }
            });
        } catch (error) {
            return jsend(500,error.message);
        }
    },
    // 8.GetOverallMasters
    getOverallMasters: async (req, res, next) => {
        try {
        const { period, startdate,enddate  } = req.payload;
                    //remove limit 20
            const data = await ExamMainCategory.aggregate([
    
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
                  '$lookup': {
                    'from': "tbl__exam_category",
                    'localField': 'exaid',
                    'foreignField': 'exa_cat_id',
                    'as': 'ExamDetail'
                  }
                },
                { "$unwind": "$ExamDetail" },
                {
                  "$group": {
                    "_id": {ec1:"$ExamData.exa_cat_name",ec2:"$ExamSrcDetailData.exa_cat_name",ec3:"$ExamDetail.exa_cat_name"},
                    "data": { "$addToSet": "$$ROOT" }
                  }
                },
                {
                  $project: {
                    count: { $sum: 1 },
                    mastercategory:"$ExamDetail.exa_cat_name",
                    maincategory:"$ExamSrcDetailData.exa_cat_name",
                    Subcategory: "$ExamData.exa_cat_name",
                    masterid :"$ExamDetail.exa_cat_id",
                    mainid:"$ExamSrcDetailData.exa_cat_id",
                    subid:"$exa_cat_id"  }
                }
              ])
                .catch((err) => {
                  return jsend(500, error.message);
                });
 const  totalquestions = await Examquestions .aggregate([
        {
           "$match": {
           //    "enddate": enddate,
            //   "exam_date": startdate,
               exam_status:{$ne:"D"}
           }
          },
                  { '$lookup': {
               'from': "tbl__exam",
               'localField': 'exam_id',
               'foreignField': 'exam_id',
               'as': 'ExamData'
             }},                      
              { "$unwind": "$ExamData" }, 
              {
                "$group": {
                    "_id":{ex: "$exam_cat",exam:"$exam_sub",exams:"$exam_sub_sub"},
                    "data": { "$addToSet": "$$ROOT" }
                }
            },  
        {
          $project: {
            totalquestions: { $sum: 1 },
            exam_cat:"$exam_cat",exam_sub:"$exam_sub",exam_sub_sub:"$exam_sub_sub"
            }
        }
      ])
        .catch((err) => {
          return jsend(500, err.message);
        });   
 const  topicwisereports = await Exams .aggregate([
        {
           "$match": {
               "enddate": "enddate",
               "exam_date": "startdate",
               exam_status:{$ne:"D"},
               exam_type_cat:"C"
           }
          },
                  { '$lookup': {
               'from': "tbl__exam",
               'localField': 'exam_id',
               'foreignField': 'exam_id',
               'as': 'ExamData'
             }},                      
              { "$unwind": "$ExamData" }, 
              {
                "$group": {
                    "_id":{ex: "$exam_cat",exam:"$exam_sub",exams:"$exam_sub_sub"},
                    "data": { "$addToSet": "$$ROOT" }
                }
            },  
        {
          $project: {
            topicwisereports: { $sum: 1 },
            exam_cat:"$exam_cat",exam_sub:"$exam_sub",exam_sub_sub:"$exam_sub_sub"
            }
        }
      ])
        .catch((err) => {
          return jsend(500, err.message);
        });
 const  fulltests = await Exams .aggregate([
        {
           "$match": {
               "enddate": "enddate",
               "exam_date": "startdate",
               exam_status:{$ne:"D"},
               exam_type_cat:"B"
           }
          },
                  { '$lookup': {
               'from': "tbl__exam",
               'localField': 'exam_id',
               'foreignField': 'exam_id',
               'as': 'ExamData'
             }},                      
              { "$unwind": "$ExamData" }, 
              {
                "$group": {
                    "_id":{ex: "$exam_cat",exam:"$exam_sub",exams:"$exam_sub_sub"},
                    "data": { "$addToSet": "$$ROOT" }
                }
            },  
        {
          $project: {
            fulltests: { $sum: 1 },
            exam_cat:"$exam_cat",exam_sub:"$exam_sub",exam_sub_sub:"$exam_sub_sub"
            }
        }
      ])
        .catch((err) => {
          return jsend(500, err.message);
        });
 const  secsubject = await Exams .aggregate([
        {
           "$match": {
               "enddate": "enddate",
               "exam_date": "startdate",
               exam_status:{$ne:"D"},
               sect_cutoff:"Y"
           }
          },
                  { '$lookup': {
               'from': "tbl__exam",
               'localField': 'exam_id',
               'foreignField': 'exam_id',
               'as': 'ExamData'
             }},                      
              { "$unwind": "$ExamData" }, 
                  {
                    "$group": {
                        "_id":{ex: "$exam_cat",exam:"$exam_sub",exams:"$exam_sub_sub"},
                        "data": { "$addToSet": "$$ROOT" }
                    }
                },  
        {
          $project: {
            secsubject: { $sum: 1 },
            exam_cat:"$exam_cat",exam_sub:"$exam_sub",exam_sub_sub:"$exam_sub_sub"
            }
        }
      ])
        .catch((err) => {
          return jsend(500, err.message);
        });
            
 const  sectiming = await Exams .aggregate([
        {
           "$match": {
               "enddate": "enddate",
               "exam_date": "startdate",
               exam_status:{$ne:"D"},
               sect_timing:"Y"
           }
          },
                  { '$lookup': {
               'from': "tbl__exam",
               'localField': 'exam_id',
               'foreignField': 'exam_id',
               'as': 'ExamData'
             }},                      
              { "$unwind": "$ExamData" }, 
                  {
                    "$group": {
                        "_id":{ex: "$exam_cat",exam:"$exam_sub",exams:"$exam_sub_sub"},
                        "data": { "$addToSet": "$$ROOT" }
                    }
                },  
        {
          $project: {
            sectiming: { $sum: 1 },
            exam_cat:"$exam_cat",exam_sub:"$exam_sub",exam_sub_sub:"$exam_sub_sub"
            }
        }
      ])
        .catch((err) => {
          return jsend(500, err.message);
        });
       

            let finalArr = [];
            for (let category of data) {
                let totalquestionsArr = totalquestions.filter(e => (e.exam_cat == category.masterid && e.exam_sub == category.mainid && e.exam_sub_sub == category.subid))
                let topicwisereportsArr = topicwisereports.filter(e => (e.exam_cat == category.masterid && e.exam_sub == category.mainid && e.exam_sub_sub == category.subid))
                let fulltestsArr = fulltests.filter(e => (e.exam_cat == category.masterid && e.exam_sub == category.mainid && e.exam_sub_sub == category.subid))
                let secsubjectArr = secsubject.filter(e => (e.exam_cat == category.masterid && e.exam_sub == category.mainid && e.exam_sub_sub == category.subid))
                let sectimingArr = sectiming.filter(e => (e.exam_cat == category.masterid && e.exam_sub == category.mainid && e.exam_sub_sub == category.subid))

                let totalquestionsCount;
                let topicwisereportsCount;
                let fulltestsCount;
                let secsubjectCount;
                let sectimingCount;
                if (totalquestionsArr.length != 0) {
                    totalquestionsCount = totalquestionsArr[0].totalquestions
                } else {
                    totalquestionsCount = 0;
                }
                if (topicwisereportsArr.length != 0) {
                    topicwisereportsCount = topicwisereportsArr[0].topicwisereports
                } else {
                    topicwisereportsCount = 0;
                }
                if (fulltestsArr.length != 0) {
                    fulltestsCount = fulltestsArr[0].fulltests
                } else {
                    fulltestsCount = 0;
                }
                if (secsubjectArr.length != 0) {
                    secsubjectCount = secsubjectArr[0].secsubject
                } else {
                    secsubjectCount = 0;
                }
                if (sectimingArr.length != 0) {
                    sectimingCount = sectimingArr[0].sectiming
                } else {
                    sectimingCount = 0;
                }
                //console.log(waitingCount);
                if (totalquestionsArr.length != 0 || topicwisereportsArr.length != 0 || fulltestsArr.length != 0 || secsubjectArr.length != 0 || sectimingArr.length != 0) {
                    finalArr.push({
                        mastercategory: category.mastercategory,
                        maincategory: category.maincategory,
                        subcategory: category.subcategory,
                        totalquestions: totalquestionsCount,
                        topicwisereports: topicwisereportsCount,
                        fulltests: fulltestsCount,
                        secsubject: secsubjectCount,
                        sectiming: sectimingCount
                    });
                }
            }

            //let { processeddata } = await getOverallmasterData(data, startdate, enddate);
            return({
                count: data.length,
                qdata: finalArr
            });

        } catch (error) {
            return jsend(500,error.message);
        }
    },
};

// Function part
async function getOverallData(data, startdate, enddate) {
    try {
        return new Promise(async (resolve, reject) => {
            var whole_data = [];
            for (let list of data) {
                const  [uploaded] = await Questions .aggregate([
                    {
                       "$match": {
                           "sub_id":list.cat_id,
                           "quest_date": startdate,
                           "enddate": "enddate"
                       }
                            },  
                    {
                      $project: {
                        uploaded: { $sum: 1 },
                        }
                    }
                  ])
                const  [waiting] = await Questions .aggregate([
                    {
                       "$match": {
                           quest_status:'W',
                           sub_id:list.cat_id,
                           quest_date: startdate,
                           enddate: enddate
                       }
                            },  
                    {
                      $project: {
                        waiting: { $sum: 1 },
                        }
                    }
                  ])
                const  [active] = await Questions .aggregate([
                    {
                       "$match": {
                           quest_status:'W',
                           sub_id:list.cat_id,
                           quest_date: startdate,
                           enddate: enddate
                       }
                            },  
                    {
                      $project: {
                        waiting: { $sum: 1 },
                        }
                    }
                  ])
                const  [inactive] = await Questions .aggregate([
                    {
                       "$match": {
                           quest_status:'N',
                           sub_id:list.cat_id,
                           quest_date: startdate,
                           enddate: enddate
                       }
                            },  
                    {
                      $project: {
                        inactive: { $sum: 1 },
                        }
                    }
                  ])
                whole_data.push({
                    maincategory: list.maincategory,
                    subcategory: list.subcategory,
                    subcategorycode: list.subcategorycode,
                    uploaded: uploaded[0].uploaded != 0 ? uploaded[0].uploaded : 0,
                    waiting: waiting[0].waiting != 0 ? waiting[0].waiting : 0,
                    active: active[0].active != 0 ? active[0].active : 0,
                    inactive: inactive[0].inactive != 0 ? inactive[0].inactive : 0
                });
            };
            resolve({
                processeddata: whole_data
            });
        });
    } catch (error) {
        return jsend(500,error.message);
    }
}

async function getMainData(data, startdate, enddate) {
    try {
        return new Promise(async (resolve, reject) => {
            var whole_data = [];
            for (let list of data) {
                const  [uploaded] = await Questions .aggregate([
                    {
                       "$match": {
                           cat_id:list.cat_id,
                           quest_date: startdate,
                           enddate: enddate
                       }
                            },  
                    {
                      $project: {
                        uploaded: { $sum: 1 },
                        }
                    }
                  ])
                const  [waiting] = await Questions .aggregate([
                    {
                       "$match": {
                         quest_status:"W",
                           cat_id:list.cat_id,
                           quest_date: startdate,
                           enddate: enddate
                       }
                            },  
                    {
                      $project: {
                        waiting: { $sum: 1 },
                        }
                    }
                  ])
                const  [active] = await Questions .aggregate([
                    {
                       "$match": {
                         quest_status:"Y",
                           cat_id:list.cat_id,
                           quest_date: startdate,
                           enddate: enddate
                       }
                            },  
                    {
                      $project: {
                        active: { $sum: 1 },
                        }
                    }
                  ])
                const  [inactive] = await Questions .aggregate([
                    {
                       "$match": {
                         quest_status:"N",
                           cat_id:list.cat_id,
                           quest_date: startdate,
                           enddate: enddate
                       }
                            },  
                    {
                      $project: {
                        inactive: { $sum: 1 },
                        }
                    }
                  ])
                whole_data.push({
                    maincategory: list.maincategory,
                    uploaded: uploaded[0].uploaded != 0 ? uploaded[0].uploaded : 0,
                    waiting: waiting[0].waiting != 0 ? waiting[0].waiting : 0,
                    active: active[0].active != 0 ? active[0].active : 0,
                    inactive: inactive[0].inactive != 0 ? inactive[0].inactive : 0
                });
            };
            resolve({
                processeddata: whole_data
            });
        });
    } catch (error) {
        return jsend(500,error.message);
    }
}
async function getTestData(data, startdate, enddate) {
    try {
        return new Promise(async (resolve, reject) => {
            var whole_data = [];

            for (let list of data) {
                let examtypename;
                if (list.examcat == 'C') {
                    const  examtypename = await ExamChapters .aggregate([
                        {
                           "$match": {
                               chapt_id:list.examptype
                           }
                                },  
                        {
                          $project: {
                           examname :chapter_name,
                            count: { $sum: 1 },
                            }
                        }
                      ])
                } else if (list.examcat == 'T') {
                    const  [examtypename] = await ExamTypes .aggregate([
                        {
                           "$match": {
                               extype_id: list.examptype
                           }
                                },  
                        {
                          $project: {
                           examname :extest_type,
                           count: { $sum: 1 },
                            }
                        }
                      ])
                }
                whole_data.push({
                    mastercategory: list.mastercategory,
                    maincategory: list.maincategory,
                    subcategory: list.subcategory,
                    examname: list.examname,
                    examcode: list.examcode,
                    examques: list.examques,
                    staffname: list.staffname,
                    examdate: new Date(list.examdate),
                    examtypename: examtypename ? examtypename[0][0].examname : 'Not Available'
                });
            }
            resolve({
                processeddata: whole_data
            });
        });
    } catch (error) {
        return jsend(500,error.messagess);
    }

}

async function getOverallmasterData(data, startdate, enddate) {
    try {
        return new Promise(async (resolve, reject) => {
            var whole_data = [];
            for (let list of data) {
                const  [totalquestions] = await ExamQuestions .aggregate([
                    {
                       "$match": {
                           extype_id: list.examptype
                       }
                            },  
                    {
                      $project: {
                       exam_id :"$exam_id",
                        totalquestions: { $sum: 1 },
                        }
                    }
                  ])
                  const  [totalExams] = await Exams .aggregate([
                     {
                       "$match": {
                           exam_status: {$ne:"D"},
                           exam_date:startdate,
                           enddate:enddate
                       }
                            }, 
                                     {
                      $group: {
            
                        _id: { name1: "$exam_cat",name2: "$exam_sub",name3: "$exam_sub_sub", },
                        data: { "$addToSet": "$$ROOT" }
                      }
                    }, 
                    {
                      $project: {
                       exam_id :"$data.exam_id",
                        count: { $sum: 1 },
                        }
                    }
                  ])
                const  [topicwisereports] = await Exams .aggregate([
                    {
                      "$match": {
                          exam_type_cat: "C",
                          exam_cat:list.masterid,
                          exam_sub:list.mainid,
                          exam_sub_sub:list.subid,
                          exam_status:{ne:"D"},
                          exam_date:startdate,
                          enddate:enddate
                      }
                           },    
                   {
                     $project: {
                       topicwisereports: { $sum: 1 },
                       }
                   }
                 ])
         const  [fulltests] = await Exams .aggregate([
             {
                "$match": {
                    exam_type_cat: "B",
                    exam_cat:list.masterid,
                    exam_sub:list.mainid,
                    exam_sub_sub:list.subid,
                    exam_status:{ne:"D"},
                    exam_date:startdate,
                    enddate:enddate
           }
                },    
        {
          $project: {
            fulltests: { $sum: 1 },
            }
        }
      ])
                const  [secsubject] = await Exams .aggregate([
                    {
                      "$match": {
                          sect_cutoff: "Y",
                          exam_cat:list.masterid,
                          exam_sub:list.mainid,
                          exam_sub_sub:list.subid,
                          exam_status:{ne:"D"},
                          exam_date:startdate,
                          enddate:enddate
                      }
                           },    
                   {
                     $project: {
                       secsubject: { $sum: 1 },
                       }
                   }
                 ])
                 const  [sectiming] = await Exams .aggregate([
         {
           "$match": {
               sect_timing: "Y",
               exam_cat:list.masterid,
               exam_sub:list.mainid,
               exam_sub_sub:list.subid,
               exam_status:{ne:"D"},
               exam_date:startdate,
               enddate:enddate
           }
                },    
        {
          $project: {
            sectiming: { $sum: 1 },
            }
        }
      ])
                whole_data.push({
                    mastercategory: list.mastercategory,
                    maincategory: list.maincategory,
                    subcategory: list.subcategory,
                    totalquestions: totalquestions[0].totalquestions != 0 ? totalquestions[0].totalquestions : 0,
                    topicwisereports: topicwisereports[0].topicwisereports != 0 ? topicwisereports[0].topicwisereports : 0,
                    fulltests: fulltests[0].fulltests != 0 ? fulltests[0].fulltests : 0,
                    secsubject: secsubject[0].secsubject != 0 ? secsubject[0].secsubject : 0,
                    sectiming: sectiming[0].sectiming != 0 ? sectiming[0].sectiming : 0
                });
            };
            resolve({
                processeddata: whole_data
            });
        });
    } catch (error) {
        return jsend(500,error.message);
    }
}