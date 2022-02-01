"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose"); 
const moment = serviceLocator.get("moment"); 
const fs = serviceLocator.get("fs");
const path = serviceLocator.get("path");
const ImageFilter = serviceLocator.get("imageFilter");
const Questions = mongoose.model("tbl__question");
const PassageQuestions = mongoose.model("tbl__passage_question");
const Category = mongoose.model("tbl__category");
const ExamQuestions = mongoose.model("tbl__examquestions");
const Exams = mongoose.model("tbl__exam");

// const { sort } = require("locutus/php/array");
// require("dotenv").config();

//-------------------------- Multer Part Start ----------------------------------//

// Ensure Questions Directory directory exists
// var homeCategoryDir = path.join(process.env.questions);
// fs.existsSync(homeCategoryDir) || fs.mkdirSync(homeCategoryDir);

// const storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         callBack(null, process.env.questions);
//     },
//     filename: (req, file, callBack) => {
//         if (
//             req.q_type == "T" ||
//             req.opt_type1 == "T" ||
//             req.opt_type2 == "T" ||
//             req.opt_type3 == "T" ||
//             req.opt_type4 == "T" ||
//             req.opt_type5 == "T"
//         ) {
//             return;
//         } else {
//             let usertype = req.payload.user.type;
//             let logintype = req.payload.user.logintype;
//             let userid = req.payload.user.userid;
//             callBack(
//                 null,
//                 `file-${logintype}-${usertype}-${userid}-${Date.now()}${path.extname(
//                     file.originalname
//                 )}`
//             );
//         }
//     },
// });

// const upload = multer({
//     storage: storage,
//     fileFilter: ImageFilter,
//     limits: { fileSize: "2mb" },
// }).fields([{
//     name: "question",
//     maxCount: 1,
// },
// {
//     name: "opt_1",
//     maxCount: 1,
// },
// {
//     name: "opt_2",
//     maxCount: 1,
// },
// {
//     name: "opt_3",
//     maxCount: 1,
// },
// {
//     name: "opt_4",
//     maxCount: 1,
// },
// {
//     name: "opt_5",
//     maxCount: 1,
// },
// ]);

//-------------------------- Multer Part End ---------------------------------------//

module.exports = {
    // 1. Get All Active Question
    getAllQuestion: async (req, res, next) => {
        try {
            const { status, cat_id, sub_id } = req.payload;
            if (!status || !cat_id || !sub_id) return jsend(400, "Please send valid request data");
            const rows = await Questions.find({
                quest_status: status, cat_id, sub_id

            }).sort({ qid: 1, ASC: 1 });
            if (!rows) {
                return jsend(404, "Question Not Found !!!");
            } else {
                const count = rows.length;
                return jsend(200, "data received Successfully",
                    { count, questions: rows });
            }
        }
        catch (error) {
            logger.error(`Error at Get All Active Question : ${error.message}`);
            return jsend(500, error.message)
        }
    },

    // 2. Get All Active Question
    getQuestionByCategories: async (req, res, next) => {
        try {
            const { sub_id } = req.params;
            if (sub_id == 0) return jsend(400, "Please send valid request data");

            const rows = await Questions.find({
                sub_id: sub_id,
            });
            if (!rows) {
                return jsend(404, "Question Not Found !!!");
            } else {
                const count = rows.length;
                return jsend(200, "data received Successfully",
                    { count, questions: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Active Question By Category : ${error.message}`);
            return jsend(500, error.message)
        }
    },

    // 2. Get Question By Id
    getQuestionById: async (req, res) => {
        try {
            const  {qId}  = req.params;
            if (qId == 0) return jsend(400, "Please send valid request data");
            let question = await Questions.findOne({
                qid: qId
            });
            if (!question) {
                return jsend(404, "Question Not Found !!!");
            }
            return jsend(200, "data received Successfully",
                { question });
        } catch (error) {
            logger.error(`Error at Get Question By Id : ${error.message}`);
            return jsend(500, error.message)
        }
    },

    // 13. Get Passage Question
    getPassageQuestionById: async (req, res, next) => {
        try {
            const { qid } = req.params;
            if (qid == 0) return jsend(400, "Please send valid request data");
           
      const rows = await Questions.aggregate([ 
                {$limit:300},                   
                { "$match":{ 
                 "qid":qid,
            }},
                  { '$lookup': {
               'from': "tbl__passage_question",
               'localField': 'qid',
               'foreignField': 'question_ref_id',
               'as': 'ExamData'
             }},                      
              { "$unwind": "$ExamData" },
               
                { "$match":{ 
                  "ExamData.passage_quest_status":{$ne:"D"}
            }},                     
             {
                    "$group": {
                        "_id": "$ExamData.passage_question_id",
                        "ExamData":{"$addToSet":"$ExamData"},
                    }
                },
                {
                    $project: {
                        "ExamData": 1,
                        _id: 0, count: { $sum: 1 }
                    }
                }
            ])
            if (!rows) {

                return jsend(404, "Category Not Found !!!");
            } else {
                console.log(rows)
                return jsend(200, "data received Successfully",
                    { question: rows });
            }

        } catch (error) {
            logger.error(`Error at Get Passage Questions By Id : ${error.message}`);
            return jsend(500, error.message)
        }
    },

    // 3. Create Question
    createQuestion: async (req, res, next) => {
        try {
            let question_code;
            // findOneAndUpdate(req, res, async function (err) {
            //     if (req.fileValidationError) {
            //         return (req.fileValidationError);
            //     } else if (err instanceof multer.MulterError) {
            //         return (err);
            //     } else if (err) {
            //         return (err);
            //     } else {
            //         console.log("Success", req.files);
            //     }

                // req.file contains information of uploaded file
                // req.body contains information of text fields, if there were any
     const {
        cat_id,sub_id, q_type,question,quest_desc, opt_type1,opt_1, opt_type2, opt_type3, opt_type4,
       opt_type5,opt_2,opt_3,opt_4,opt_5,crt_ans,quest_level,quest_pos,quest_ipaddr,} = req.payload;
                console.log(req.payload);
                //const { id, name, type } = req.user;
              
                const { questionNo } = await getQuestionNumber(
                    cat_id, sub_id
                ).catch((err) => {
                    console.log(err);
                });

                        // 1. tbl__exampackage insert
                        const questiondata = await Questions.create({
                            cat_id,
                            sub_id,
                           // quest_add_type: req.user.type, //type,
                            q_type,
                            question: q_type == "I" ? req.files.question[0].filename : question,
                            question_code: questionNo,
                            quest_desc,
                            opt_type1,
                            opt_1: opt_type1 == "I" ? req.files.opt_1[0].filename : opt_1,
                            opt_type2,
                            opt_type3,
                            opt_type4,
                            opt_type5,
                            opt_2: opt_type2 == "I" ? req.files.opt_2[0].filename : opt_2,
                            opt_3: opt_type3 == "I" ? req.files.opt_3[0].filename : opt_3,
                            opt_4: opt_type4 == "I" ? req.files.opt_4[0].filename : opt_4,
                            opt_5: opt_type5 == "I" ? req.files.opt_5[0].filename : opt_5,
                            crt_ans,
                            quest_level,
                          //  quest_add_id: req.user.userid, //id,
                          //  quest_add_by: req.user.username, //name,
                            quest_pos,
                            quest_status: "W", //type == "A" ? "Y" : "W",
                            quest_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            aproved_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            quest_ipaddr,
                            lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                //         })
                //    // })
                //     .catch((err) => {
                //         return jsend(404,err.message);
                //     });
                //     return jsend(200, "data received Successfully",
                //     { message: "Insert Success" });
                         } ).catch((err) => {
                    return jsend(404,err.message);
                });
                if(questiondata){
                    return jsend(200, "data received Successfully",result,
                    { message: "Create Success" })
                }else{
                    return jsend(500, "Please try again after sometime")
                }
          //  });
        } catch (error) {
            logger.error(`Error at Create Question : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 6. CreatePassageQuestions
    createPassageQuestions: async (req, res, next) => {
      //  const t = await db.sequelize.transaction();
        try {

            // findOneAndUpdate(req, res, async function (err) {
            //     if (req.fileValidationError) {
            //         return res.send(req.fileValidationError);
            //     } else if (err instanceof multer.MulterError) {
            //         return jsend(err);
            //     } else if (err) {
            //         return jsend(err);
            //     } else {
            //         console.log("Success", req.files);
            //     }

          const {
               cat_id, sub_id,q_type,question,quest_desc,opt_type1,opt_1,opt_type2, opt_type3, opt_type4,
               opt_type5, opt_2, opt_3, opt_4, opt_5, crt_ans, quest_level, quest_pos, quest_ipaddr,
                passage_questions } = req.payload;
                // const { questionNo } = await getQuestionNumber(
                //     cat_id, sub_id
                // ).catch((err) => {
                //     console.log(err);
                // });

                        // 1. tbl__exampackage insert
                        const questiondata = await Questions.create({
                            cat_id,
                            sub_id,
                        //    quest_add_type: req.payload.user.type, //type,
                            q_type,
                            question: question,
                            question_code: questionNo,
                            quest_desc,
                            opt_type1: "T",
                            opt_1: opt_1,
                            opt_type2: "T",
                            opt_type3: "T",
                            opt_type4: "T",
                            opt_type5: "T",
                            opt_2: opt_2,
                            opt_3: opt_3,
                            opt_4: opt_4,
                            opt_5: opt_5,
                            crt_ans,
                            quest_level,
                            quest_add_id: req.payload.user.userid, //id,
                            quest_add_by: req.payload.user.username, //name,
                            quest_pos,
                            quest_status: "W", //type == "A" ? "Y" : "W",
                            quest_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            aproved_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            quest_ipaddr,
                            lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        });

                        console.log(questionNo);
                        console.log(passage_questions.length);

                        let passagequestionList = [];
                        for (let list of passage_questions) {
                            passagequestionList.push({
                                question_ref_id: questiondata.qid,
                                passage_q_type: 'T',
                                passage_question: list.question,
                                passage_quest_desc: list.quest_desc,
                                passage_opt_type1: 'T',
                                passage_opt_type2: 'T',
                                passage_opt_type3: 'T',
                                passage_opt_type4: 'T',
                                passage_opt_type5: 'T',
                                passage_opt_1: list.opt_1,
                                passage_opt_2: list.opt_2,
                                passage_opt_3: list.opt_3,
                                passage_opt_4: list.opt_4,
                                passage_opt_5: list.opt_5,
                                passage_crt_ans: list.crt_ans,
                                passage_quest_add_id: req.payload.user.userid, //id,
                                passage_quest_add_by: req.payload.user.username, //name,
                                passage_quest_pos: list.quest_pos,
                                passage_quest_status: "W", //type == "A" ? "Y" : "W",
                                passage_quest_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                passage_aproved_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                passage_quest_ipaddr: list.quest_ipaddr,
                                passage_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            });
                        };
                        console.log(passagequestionList);

                        // 3. tbl__exampackage_duration insert
                        // await PassageQuestions.bulkCreate(passagequestionList, {

                        await PassageQuestions.create(passagequestionList, {
                        })
                  // })
                    .catch((err) => {
                        return jsend(404, err.message);
                    });
                return ({ message: "Insert Success" });
           
        } catch (error) {
            logger.error(`Error at Create Bank Exam : ${error.message}`);
            return jsend(500, error.message)
        }
    },

    // 14. Update Passage Question
    updatePassageQuestions: async (req, res, next) => {
        try {

            const { qid } = req.params;
            upload(req, res, async function (err) {
                if (req.fileValidationError) {
                    return res.send(req.fileValidationError);
                } else if (err instanceof multer.MulterError) {
                    return res.send(err);
                } else if (err) {
                    return res.send(err);
                } else {
                    console.log("Success", req.files);
                }

                const {
                    cat_id,
                    sub_id,
                    q_type,
                    question,
                    quest_desc,
                    opt_type1,
                    opt_1,
                    opt_type2,
                    opt_type3,
                    opt_type4,
                    opt_type5,
                    opt_2,
                    opt_3,
                    opt_4,
                    opt_5,
                    crt_ans,
                    quest_level,
                    quest_pos,
                    quest_ipaddr,
                    passage_questions
                } = req.payload;
                console.log(req.body);
                console.log("passage", passage_questions);
                console.log(req.payload.user);

                let { questionNo } = await getQuestionNumber(
                    cat_id, sub_id
                ).catch((err) => {
                    console.log(err);
                });

                db.sequelize
                    .transaction(async (t) => {
                        // 1. tbl__exampackage insert
                        const questiondata = await Questions.findOneAndUpdate({ qid: qid,
                            cat_id,
                            sub_id,
                            quest_add_type: req.payload.user.type, //type,
                            q_type,
                            question: question,
                            question_code: questionNo,
                            quest_desc,
                            opt_type1: "T",
                            opt_1: opt_1,
                            opt_type2: "T",
                            opt_type3: "T",
                            opt_type4: "T",
                            opt_type5: "T",
                            opt_2: opt_2,
                            opt_3: opt_3,
                            opt_4: opt_4,
                            opt_5: opt_5,
                            crt_ans,
                            quest_level,
                            quest_add_id: req.payload.user.userid, //id,
                            quest_add_by: req.payload.user.username, //name,
                            quest_pos,
                            quest_status: "W", //type == "A" ? "Y" : "W",
                            quest_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            aproved_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            quest_ipaddr,
                            lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        },
                        );

                        console.log(questionNo);
                        console.log(passage_questions.length);

                        let passagequestionList = [];
                        for (let list of passage_questions) {
                            if (list.passage_question_id) {
                                passagequestionList.push({
                                    passage_question_id: list.passage_question_id,
                                    question_ref_id: qid,
                                    passage_q_type: 'T',
                                    passage_question: list.question,
                                    passage_quest_desc: list.quest_desc,
                                    passage_opt_type1: 'T',
                                    passage_opt_type2: 'T',
                                    passage_opt_type3: 'T',
                                    passage_opt_type4: 'T',
                                    passage_opt_type5: 'T',
                                    passage_opt_1: list.opt_1,
                                    passage_opt_2: list.opt_2,
                                    passage_opt_3: list.opt_3,
                                    passage_opt_4: list.opt_4,
                                    passage_opt_5: list.opt_5,
                                    passage_crt_ans: list.crt_ans,
                                    passage_quest_add_id: req.payload.user.userid, //id,
                                    passage_quest_add_by: req.payload.user.username, //name,
                                    passage_quest_pos: list.quest_pos,
                                    passage_quest_status: "W", //type == "A" ? "Y" : "W",
                                    passage_quest_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    passage_aproved_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    passage_quest_ipaddr: list.quest_ipaddr,
                                    passage_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                });
                            } else {
                                passagequestionList.push({
                                    question_ref_id: qid,
                                    passage_q_type: 'T',
                                    passage_question: list.question,
                                    passage_quest_desc: list.quest_desc,
                                    passage_opt_type1: 'T',
                                    passage_opt_type2: 'T',
                                    passage_opt_type3: 'T',
                                    passage_opt_type4: 'T',
                                    passage_opt_type5: 'T',
                                    passage_opt_1: list.opt_1,
                                    passage_opt_2: list.opt_2,
                                    passage_opt_3: list.opt_3,
                                    passage_opt_4: list.opt_4,
                                    passage_opt_5: list.opt_5,
                                    passage_crt_ans: list.crt_ans,
                                    passage_quest_add_id: req.payload.user.userid, //id,
                                    passage_quest_add_by: req.payload.user.username, //name,
                                    passage_quest_pos: list.quest_pos,
                                    passage_quest_status: "W", //type == "A" ? "Y" : "W",
                                    passage_quest_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    passage_aproved_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                    passage_quest_ipaddr: list.quest_ipaddr,
                                    passage_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                });
                            }
                        };
                        console.log(passagequestionList);

                        // 3. tbl__exampackage_duration insert
                        await PassageQuestions.bulkCreate(passagequestionList, {
                            updateOnDuplicate: [
                                "passage_q_type",
                                "passage_question",
                                "passage_quest_desc",
                                "passage_opt_type1",
                                "passage_opt_type2",
                                "passage_opt_type3",
                                "passage_opt_type4",
                                "passage_opt_type5",
                                "passage_opt_1",
                                "passage_opt_2",
                                "passage_opt_3",
                                "passage_opt_4",
                                "passage_opt_5",
                                "passage_crt_ans",
                                "passage_quest_add_id",
                                "passage_quest_add_by",
                                "passage_quest_pos",
                                "passage_quest_status",
                                "passage_quest_date",
                                "passage_aproved_date",
                                "passage_quest_ipaddr",
                                "passage_lastupdate"
                            ]
                        }, { transaction: t });
                    })
                    .catch((err) => {
                        return jsend(404, err.message);
                    });
                return jsend(200, "data received Successfully",
                    { message: "Insert Success" });
            });
        } catch (error) {
            logger.error(`Error at Create Bank Exam : ${error.message}`);
            return jsend(500, error.message)
        }
    },

    // 4. Update Question By Id
    updateQuestionById: async (req, res, next) => {
        try {
            upload(req, res, async function (err) {
                if (req.fileValidationError) {
                    return (req.fileValidationError);
                } else if (err instanceof multer.MulterError) {
                    return jsend(err);
                } else if (err) {
                    return jsend(err);
                } else {
                    console.log("Success", req.files);
                }

                // req.file contains information of uploaded file
                // req.body contains information of text fields, if there were any
                const { qId } = req.params;
                if (qId == 0) return jsend(400, "Please send valid request data");
                const {
                    cat_id, sub_id, q_type, question, question_code, quest_desc, opt_type1, opt_1, opt_type2,
                    opt_type3, opt_type4, opt_type5, opt_2, opt_3, opt_4, opt_5, crt_ans, quest_level, quest_pos,
                    quest_ipaddr, } = req.payload;
                console.log(req.payload);

                const questionvalue = await Questions.findOne({
                      //  qid: qId,
                });

                let questiondata;
                q_type == "I" ?
                    req.files.question ?
                        (questiondata = req.files.question[0].filename) :
                        (questiondata = questionvalue.question) :
                    (questiondata = question);

                let opt1data;
                opt_type1 == "I" ?
                    req.files.opt_1 ?
                        (opt1data = req.files.opt_1[0].filename) :
                        (opt1data = questionvalue.opt_1) :
                    (opt1data = opt_1);

                let opt2data;
                opt_type2 == "I" ?
                    req.files.opt_2 ?
                        (opt2data = req.files.opt_2[0].filename) :
                        (opt2data = questionvalue.opt_2) :
                    (opt2data = opt_2);

                let opt3data;
                opt_type3 == "I" ?
                    req.files.opt_3 ?
                        (opt3data = req.files.opt_3[0].filename) :
                        (opt3data = questionvalue.opt_3) :
                    (opt3data = opt_3);

                let opt4data;
                opt_type4 == "I" ?
                    req.files.opt_4 ?
                        (opt4data = req.files.opt_4[0].filename) :
                        (opt4data = questionvalue.opt_4) :
                    (opt4data = opt_4);

                let opt5data;
                opt_type5 == "I" ?
                    req.files.opt_5 ?
                        (opt5data = req.files.opt_5[0].filename) :
                        (opt5data = questionvalue.opt_5) :
                    (opt5data = opt_5);

                const ExamQc = await Questions.findOneAndUpdate({ qid: qId },
                    {
                        cat_id,
                        sub_id,
                        q_type,
                        question: questiondata,
                        question_code,
                        quest_desc,
                        opt_type1,
                        opt_1: opt1data,
                        opt_type2,
                        opt_type3,
                        opt_type4,
                        opt_type5,
                        opt_2: opt2data,
                        opt_3: opt3data,
                        opt_4: opt4data,
                        opt_5: opt5data,
                        crt_ans,
                        quest_level,
                        quest_pos,
                        quest_ipaddr,
                        lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    },
                ).catch((err) => {
                    return jsend(404, err.message);
                });
                if (ExamQc) {
                    return jsend(200, "data received Successfully",
                        { message: "Updated Success" })
                } else {
                    return jsend(500, "Please try again after sometime")
                }
            });
        } catch (error) {
            logger.error(`Error at Update Question : ${error.message}`);
            return jsend(500, error.message)
        }
    },

    // 15. Delete Passage Question
    deletePassageQuestions: async (req, res, next) => {
        try {
            const { qid } = req.params;
            await PassageQuestions.findOneAndUpdate({
                passage_quest_status: "D",
            }, { passage_question_id: qid });
            return jsend(200, "data received Successfully",
                { message: "Delete Success" });
        } catch (error) {
            logger.error(`Error at Delete Question : ${error.message}`);
            return jsend(500, error.message)
        }
    },

    // 5. Question Number
    getQuestionNo: async (req, res, next) => {
        try {
            const { cat_id, sub_id } = req.payload;
            if (!cat_id || !sub_id) return jsend(400, "Please send valid request data");

            let count = 0;
            let catCode = "";

            //   await db.sequelize.transaction(async (t) => {
            const counts = await Questions.count(
                { cat_id, sub_id },
                // { transaction: t }
            ).catch((error) => {
                count = counts;
                return jsend(200, "data received Successfully", { count })
            });

            const result = await Category.findOne({
               cat_id: sub_id,
                pid: cat_id,
            }
            ).catch((err) => {
                return jsend(500, error.message);
            });
            return jsend(200, "data received Successfully",
                { questionNo: catCode + (count + 1).toString().padStart(3, "0") }
                //});
                //console.log(catCode + (count + 1).toString().padStart(4, "0")
            );

        } catch (error) {
            logger.error(`Error at Get Question No : ${error.message}`);
            return jsend(500, error.message);
        }
    },

    getAllocateQuestion: async (req, res, next) => {
        try {
            const { pagecount, exam_id, exam_master_id, exam_cat_id } = req.payload;
            if (!pagecount || !exam_id || !exam_master_id || !exam_cat_id)
                return jsend(400, "Please send valid request data");

            const Exam = await Exams.findOne({
               exam_id: exam_id ,
            });
            let offset = (pagecount - 1) * 1000;
            const [question] = await db.sequelize.query(
                ` select a.qid,a.q_type,a.question,a.quest_add_by,a.quest_date,a.quest_level,
           a.quest_status,a.question_code
              ,b.cat_name as 'Category',c.cat_name as 'Subcategory' from tbl__question as a
		    inner join tbl__category as b on a.cat_id= b.cat_id
                inner join tbl__category as c on a.sub_id= c.cat_id 
                where a.quest_level in(` +
                Exam.exam_level +
                `) and a.quest_status='Y' and a.qid not in
                (select qid from tbl__examquestions where exam_id=? and exam_cat=?
                and exam_subcat=? and exam_queststatus='Y') order by a.qid desc
		limit 1000 OFFSET ${offset}`, {
                replacements: [exam_id, exam_master_id, exam_cat_id],
            }
            );

            examQuestionsList = [];
            question.forEach((row) => {
                examQuestionsList.push(row.qid);
            });


            let questiondata = examQuestionsList.join();
            if (examQuestionsList.length != 0) {
                const [examquestion] = await db.sequelize.query(
                    ` select qid from tbl__examquestions where exam_id!=? 
                    and exam_queststatus='Y' and exam_cat=?
                    and exam_subcat=? 
                    and qid in (` +
                    questiondata +
                    `)
                    group by qid
                    `, {
                    replacements: [exam_id, exam_master_id, exam_cat_id],
                }
                );
                return ({ count: question.length, question, examquestion });
            } else {
                let examquestion = [];
                return ({ count: question.length, question, examquestion });
            }
        } catch (error) {
            logger.error(`Error at Allocate Question : ${error.message}`);
            return (error);
        }
    },
    getAllocateQuestionTotalCount: async (req, res, next) => {
        try {
            const { exam_id, exam_master_id, exam_cat_id } = req.payload;
            if (!exam_id || !exam_master_id || !exam_cat_id) return jsend(400, "Please send valid request data");

            const Exam = await Exams.findOne({
               exam_id: exam_id ,
            })
       
            
  const  question = await Questions .aggregate([
                 {
           "$match": {
              "quest_level": Exam.exam_level,
               quest_status:"Y"
          }
        },
                  {
          $project: {
            qid: { $sum: 1 },
            totalcount:"$qid"
            }
        }
        ]);
            return jsend(200, "data received Successfully",
                { totalcount: question[0].totalcount });
        } catch (error) {
            logger.error(`Error at Allocate Question Total Count : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 6. Update 'Active / Inactive / Delete'
    updateStatusById: async (req, res, next) => {
        try {
            const { qid, status } = req.payload;
            if (!qid || !status)  return jsend(400, "Please send valid request data");

                    if (status == "Y") {
                        await Questions.findOneAndUpdate({
                            //qid: qid ,
                             qid: qid ,
                            quest_status: status,
                            aproved_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        });
                    } else {
                   const result =  await Questions.findOneAndUpdate(
                            { qid: qid ,
                                quest_status: status 
                                 } , 
                               
               // { transaction: t }
               ) .catch((err) => {
                return jsend(404, err.message);
            });
                if(result){
                    return jsend(200, "data received Successfully",
                        { message: "Updated Success",result })
                }else{
                    return jsend(500, "Please try again after sometime")
                }}
        } catch (error) {
            logger.error(`Error at Update Common Exam : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 11. Question Search Result
    getSearchResult: async (req, res, next) => {
        try {
            const { qType, difficulty, faculty, searchString, sortBy, cat_id, sub_id, datatype } = req.payload;
       if (
           qType == null ||difficulty == null || faculty == null || searchString == null ||
           sortBy == null ||cat_id == null ||sub_id == null || datatype == null )
            return jsend(400, "Please send valid request data");
            sortBy == "" ? (sortBy = "ASC") : sortBy;
            if (!!searchString) searchString = `%${searchString}%`;

            let conditions = ``;

            if (qType != "") {
                conditions = `q_type = '${qType}' AND `;
            }
            if (faculty != "") {
                conditions = conditions + `quest_add_id = ${faculty} AND `;
            }
            if (searchString != "") {
                conditions = conditions + `question LIKE '${searchString}' OR question_code LIKE '${searchString}' AND `;
            }
            if (difficulty != "") {
                conditions = conditions + `quest_level = ${difficulty} AND `;
            }

            const [questions] = await db.sequelize.query(
                `SELECT qid,q_type,question,question_code,
                quest_desc,quest_date,opt_1,opt_2,opt_3,opt_4,opt_5,
                opt_type1,opt_type2,opt_type3,opt_type4,opt_type5,
                crt_ans,quest_level,quest_add_by 
                FROM tbl__question WHERE ${conditions} quest_status = '${datatype}' AND cat_id = ${cat_id} AND sub_id = ${sub_id} ORDER BY quest_date ${sortBy};`,

            );
            if (!questions) {
                return({ count, questions: "Not Found !!!" });
            }else{
            return jsend(200, "data received Successfully",
            { count: questions.length, questions });
            }

        } catch (error) {
            logger.error(`Error at Question Search Result : ${error.message}`);
            return jsend(500, error.message)
        }
    },

    // 7. Get Dashboard Count
    getQuestionsCount: async (req, res, next) => {
        try {
            const count = await Questions.count({
                quest_status: {
                    $ne: 'D'
                }
            }).catch((error) => {
                return jsend(500, error.message);
            });
          return jsend(200, "data received Successfully",{ count });
        } catch (error) {
            logger.error(`Error at Get Dashboard Count : ${error.message}`);
            return jsend(500, error.message);
        }
    },

    // 10. Get Questions Count Only
    getQuestionsCountOnly: async (req, res, next) => {
        try {
            const { quest_status, sub_id, cat_id } = req.payload;
            if (!quest_status || !sub_id || !cat_id) return jsend(400, "Please send valid request data");
            let count = 0;
            quest_add_id: req.user.id,
            // Add this to where quest_add_id
            count = await Questions.count({
                quest_status, sub_id, cat_id
            }).catch(
                (err) => {
                    return jsend(500, error.message);
                }
            );
           return jsend(200, "data received Successfully",{ count });
        } catch (error) {
            logger.error(`Error at Get Questions Count Only : ${error.message}`);
            return jsend(500, error.message);
        }
    },


    getCategoryName: async (req, res, next) => {
        try {
            const { cat_id, sub_id } = req.payload;
            if (!cat_id || !sub_id)return jsend(400, "Please send valid request data");
            const [category] = await Category.aggregate([ 
                                 
                { "$match":{ 
               cat_id:cat_id,
         
            }},
                  { '$lookup': {
               'from': "tbl__category",
               'localField': 'cat_id',
               'foreignField': 'pid',
               'as': 'ExamData'
             }},                      
             { "$unwind": "$ExamData" },
                {$sort:{"exam_id":1}},
                { "$match":{ 
             //"ExamData.cat_id":sub_id
            }},   
             {$project:{
                 maincategory:"$cat_name",
                 subcategory:"$ExamData.subcategory",
                  _id:0 ,count:{$sum:1} }}                 
                  ])

            if (!category) {
                return jsend(404, "Question Not Found !!!");
            } else {
                return jsend(200, "data received Successfully",
                    {
                        maincategory: category.maincategory,
                        subcategory: category.subcategory
                    });
            }
        } catch (error) {
            logger.error(`Error at Get All Active Question : ${error.message}`);
            return jsend(500, error.message)
        }
    }
};

function getQuestionNumber(cat_id, sub_id) {
    return new Promise((resolve, reject) => {
        try {
            let count = 0;
            let catCode = "";
         
             Qcexam =   Questions.count({
                    cat_id, sub_id ,
                    transaction: t 
                    }).then(
                    (counts) => {
                        count = counts;
                    }
                );

                 Category.findOne({
                    attributes: ["cat_code"],

                    cat_id: sub_id,
                    pid: cat_id,

                }).then((result) => {
                    catCode = result.cat_code;
                });
                let questionNo = catCode + (count + 1).toString().padStart(3, "0");
                resolve({ questionNo });
            
        } catch (error) {
           logger.error(`Error at Get All Exam By Status : ${error.message}`);
            return jsend(500, error.message);
        }
    });
}