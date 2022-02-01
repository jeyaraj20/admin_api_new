"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose"); 
const moment = serviceLocator.get("moment"); 
const Operator = mongoose.model("tbl__operator");

module.exports = {
    // 1. Get All Active Operator
    getAllActiveOperator: async (req, res, next) => {
    
        try {
            const {status}  = req.params;
            const rows = await Operator.aggregate([ 
                   //  {$limit:1},    
                { "$match":{ 
                op_status:status
            }},
                  { '$lookup': {
               'from': "tbl__question",
               'localField': 'op_id',
               'foreignField': 'quest_add_id',
               'as': 'ExamData'
             }},                      
              { "$unwind": "$ExamData" },
              { '$lookup': {
                'from': "tbl__question",
                'localField': 'op_uname',
                'foreignField': 'quest_add_by',
                'as': 'ExamDetails'
              }}, 

             { "$match":{ 
                  "ExamData.quest_status":{ $ne: "D" }
            }},                     
             {"$group": {
                        "_id": "$op_id",
                        "data": { "$addToSet": "$$ROOT" }
                    }
                    },
             {$project:{
                  ExamData:"$data.ExamData",
                  actcount:"$data.ExamData.quest_status",
                  _id:0 ,count:{$sum:1} }}                 
                  ])
                  const Question = await Operator.aggregate([ 

                    { "$match":{ 
                        op_status:status
                       }},

                    { '$lookup': {
                        'from': "tbl__question",
                        'localField': 'op_uname',
                        'foreignField': 'quest_add_by',
                        'as': 'ExamData'
                      }},                        
                      { "$unwind": "$ExamData" },
                      {"$group": {
                        "_id": "$op_id",
                        "data": { "$addToSet": "$$ROOT" }
                    }
                    },
             {$project:{
                  ExamQCData:"$data.ExamData",
                  actcount:"$data.ExamData.quest_status",
                  _id:0 ,count:{$sum:1} }}   

                  ])
                  console.log(rows)
            if (!rows){
                return jsend(404,"Operator Not Found !!! ");
            }else{
                const count = rows.length
                const QuestionCount = Question.length
                return jsend(200, "data received Successfully",
                {count,rows,QuestionCount,Question});
            }
          
        } catch (error) {
            logger.error(`Error at Get All Active Operator : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 2. Get All InActive Operator
    getAllInactiveOperator: async (req, res, next) => {
        try {
            const rows  = await Operator.find({
               op_status: "N" ,
            }).sort({ op_type: 1 });

            if (!rows) {
                return jsend(404,"Operator Not Found !!!");
            }else{
            const count = rows.length;
            return jsend(200, "data received Successfully",
            { count, Operator: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All InActive Operator : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 3. Get Operator By Id
    getOperatorById: async (req, res, next) => {
        try {
            const { opId } = req.params;
            if (opId == 0)  return jsend(400, "Please send valid request data");

            const operators = await Operator.findOne({
                    op_id: opId,
                    op_status: "Y",
            });
            if (!operators) {
                return jsend(404,"Operator Not Found !!!"); 
            }else{
                const count = operators.length;
                return jsend(200, "data received Successfully",
                { operators});
            }
        } catch (error) {
            logger.error(`Error at Get Operator By Id : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 4. Create Operator
    createOperator: async (req, res, next) => {
        try {
            const { op_name, op_uname, op_password, op_type, feat_id } = req.payload;
            if (!op_name || !op_uname || !op_password || !op_type || !feat_id)
            return jsend(400, "Please send valid request data");

            const password = Buffer.from(op_password).toString("base64");

               const result = await Operator.create(
                    {
                        op_name,
                        op_uname,
                        op_password: password,
                        op_type,
                        feat_id,
                        op_status: "Y",
                        op_dt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        op_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    },
                   ).catch((err) => {
                    return jsend(404,err.message);
                });
                if(result){
                    return jsend(200, "data received Successfully",result,
                    { message: "Create Success" })
                }else{
                    return jsend(500, "Please try again after sometime")
                }
          
        } catch (error) {
            logger.error(`Error at Create Operator : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 5. Update Operator By Id
    updateOperatorById: async (req, res, next) => {
        try {
            const { opId } = req.params;
            if (opId == 0)return jsend(400, "Please send valid request data");

            const { op_name, op_uname, op_password, op_type, feat_id } = req.payload;
            if (!op_name || !op_uname || !op_password || !op_type || !feat_id)
            return jsend(400, "Please send valid request data");

            const password = Buffer.from(op_password).toString("base64");
            const result  =  await Operator.findOneAndUpdate(
                    {
                        op_name,
                        op_uname,
                        op_password: password,
                        op_type,
                        feat_id,
                        op_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    },
                    {  op_id: opId  },
                    ) .catch((err) => {
                        return jsend(404, err.message);
                    });
                        if(result){
                            return jsend(200, "data received Successfully",
                                { message: "Updated Success" })
                        }else{
                            return jsend(500, "Please try again after sometime")
                        }
        } catch (error) {
            logger.error(`Error at Update Operator : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 6. Update 'Inactive / Active / Delete'
    updateInactiveById: async (req, res, next) => {
        try {
            const { opId, status } = req.payload;
            if (!opId || !status)return jsend(400, "Please send valid request data");

              const result =  await Operator.findOneAndUpdate(
                    { op_status: status },
                    { op_id: opId  },
                  ) .catch((err) => {
                    return jsend(404, err.message);
                });
                    if(result){
                        return jsend(200, "data received Successfully",
                            { message: "Updated Success" })
                    }else{
                        return jsend(500, "Please try again after sometime")
                    }
        } catch (error) {
            logger.error(`Error at Update Operator Status : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 7. Get Operators Count Only
    getOperatorsCount: async (req, res, next) => {
        try {
            const { op_status } = req.params;
            if (op_status == null) return jsend(404, err.message);
            const count = await Operator.count({ 
                op_status: op_status
            }).catch((err) => {
                return jsend(500, err.message);
            });
          return jsend(200, "data received Successfully",{ count });
        } catch (error) {
            logger.error(`Error at Get Operators Count Only : ${error.message}`);
            return jsend(500, error.message);
        }
    },
    // 8. GetAllOperator
    getAllOperator: async (req, res, next) => {
        try {
            const { status } = req.params;
            const operator = await Operator.aggregate([
                { "$match":{ 
                    "op_status":status
              }}, 
              {$sort:{op_name:1}}, 
             ] );
            if (!Operator) {
                return jsend(404,"Operator Not Found !!!");
            }else{
            return jsend(200, "data received Successfully",
            { count: operator.length, operator });
            }
        } catch (error) {
            logger.error(`Error at Get All Active Operator : ${error.message}`);
             return jsend(500, error.message)
        }
    },
};
