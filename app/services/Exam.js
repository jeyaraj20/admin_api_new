"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const { Console } = require("winston/lib/winston/transports");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose"); 
const moment = serviceLocator.get("moment"); 
const Exams = mongoose.model("tbl__exam");
const AutomaticQuestionDetails = mongoose.model("tbl__automatic_question_details");
const Question = mongoose.model("tbl__question");
const ExamQuestions = mongoose.model("tbl__examquestions");
const ExamSectionDetails = mongoose.model("tbl__exam_sectdetails");
const ExamType = mongoose.model("tbl__examtypes");
const Examchapters = mongoose.model("tbl__examchapters");
const Examtakenlist = mongoose.model("tbl__examtaken_list");
const OrderItems =mongoose.model("tbl__orderitems")
module.exports = {
    // 1. Get All Exam By Status
    getAllExam: async (req, res, next) => {
        try {
            let { type, status, exa_cat_id } = req.payload;
            if (!type || !status || !exa_cat_id) return jsend(400, "Please send valid request data");
            const  rows  = await Exams.find({
                    exam_type: type,
                    exam_status: status,
                    exam_sub_sub: exa_cat_id,
            }).sort({ exam_id: 1 });

            if (!rows) {
                return jsend(500,"Exam Not Found !!!");
            }else{
            const count = rows.length;
           return jsend(200, "data received Successfully",
           { count, Exam: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Exam By Status : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 2.GetAllExamWithAssignedcount
    getAllExamWithAssignedcount: async (req, res, next) => {
        try {
            let { type, status, exa_cat_id } = req.payload;
            if (!type || !status || !exa_cat_id) return jsend(400, "Please send valid request data");

        //     const [Exam] = await db.sequelize.query(`
        //    SELECT a.*,
        //    COUNT(b.exam_id) as totalassigned FROM tbl__exam AS a 
        //    left join tbl__examquestions as b on a.exam_id=b.exam_id and b.exam_queststatus='Y'
        //    WHERE a.exam_type = '${type}' AND a.exam_status = '${status}' 
        //     AND a.exam_sub_sub = ${exa_cat_id} 
        //     group by a.exam_id
        //     ORDER BY a.exam_id;`
        //     );
                    const [Exam] = await Exams.aggregate([ 
                          {$limit:300},                   
                          { "$match":{ 
                          exam_type:type,
                          exam_status:status,
                          exam_sub_sub:exa_cat_id,
                          }},
                          { '$lookup': {
                            'from': "tbl__examquestions",
                            'localField': 'exam_id',
                            'foreignField': 'exam_id',
                            'as': 'ExamData'
                          }},                      
                         { "$unwind": "$ExamData" },                     
                        //   { "$match":{  exam_queststatus:"Y"
                        //   }},
                         {$sort:{"exam_id":1}},
                         {"$group": {
                          "_id": "$exam_id",
                          "data": { "$addToSet": "$$ROOT" }
                          }},
                       {$project:{
                         totalassigned:"$data.ExamData.exam_id",
                        "data.ExamData":1, _id:0 ,count:{$sum:1} 
                         }}                 
                        ])

            if (!Exam) {
                return jsend(404,"Exam Not Found !!!");
            }else{
                const count = Exam.length
            return jsend(200,"data received Successfully",{ count , Exam: Exam });
            }
        } catch (error) {
            logger.error(`Error at Get All Exam By Status : ${error.message}`);
            return jsend(500, error.message);
        }
    },
    // 3. GetAllExamCount
    getAllExamCount: async (req, res, next) => {
        try {
            const { type, status, exa_cat_id } = req.payload;
            if (!type || !status || !exa_cat_id) return jsend(400, "Please send valid request data");
            count = await Exams.count({
                exam_type: type, exam_status: status, exam_sub_sub: exa_cat_id 
            }).catch((err) => {
              return jsend(500, err.message);
            });
            return jsend(200, "data received Successfully", { count });
        } catch (error) {
            logger.error(`Error at Get All Exam By Status : ${error.message}`);
            return jsend(500, error.message);
        }
    },
    // 4. Get Exam By Id
    getExamById: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (id == 0) return jsend(400, "Please send valid request data");
            const Exam = await Exams.findOne({
                // include: [ {model: db.ExamSectionDetails, },],
                exam_id: id 
            });
            if (!Exam) {
                return jsend(500,"Exam Not Found !!!");
            }else{
            return jsend(200, "data received Successfully",{ Exam });
            }
        } catch (error) {
            logger.error(`Error at Get Exam By Id : ${error.message}`);
            return jsend(500, error.message);
        }
    },
    // 5. Create Common Exam
    createExam: async (req, res, next) => {
       // const t = await db.sequelize.transaction();
        try {
           // console.log(req.payload);
   const { exam_cat,exam_sub, exam_sub_sub,exam_name,exam_slug,assign_test_type, exam_type, exam_code,
           exam_level, sect_cutoff,sect_timing,tot_questions, tot_mark, mark_perquest, neg_markquest,
           total_time, quest_type, exam_type_cat,exam_type_id,exam_pos,payment_flag, selling_price,
           offer_price,ip_addr, automatic } = req.payload;

   if (!exam_cat || !exam_sub ||  !exam_sub_sub || !exam_name ||!exam_slug || !assign_test_type ||
           !exam_type || !exam_code || !exam_level || !sect_cutoff || !sect_timing ||!tot_questions ||
           !tot_mark || !mark_perquest || !neg_markquest ||!total_time || !quest_type || !exam_type_cat ||
           !exam_type_id ||!exam_pos || !ip_addr
            )
            return jsend(400, "Please send valid request data");;

            const  created = await Exams.create({
                exam_code, 
                //exam_status: {$ne:"D"},
          defaults: {
                    exam_cat,
                    exam_sub, 
                    exam_sub_sub,
                    exam_name,
                    exam_slug,
                    assign_test_type,
                    exam_type,
                    exam_code,
                    exam_level,
                    sect_cutoff,
                    sect_timing,
                    tot_questions,
                    tot_mark,
                    mark_perquest,
                    neg_markquest,
                    total_time,
                    quest_type,
                    exam_type_cat,
                    exam_type_id,
                    exam_pos,
                    exam_status: "W",
                    exam_add_type: "S",
                    exam_add_id: "WE",//req.payload.user.id,
                    exam_add_name: "WW",//req.payload.user.username,
                    exam_date: moment(Date.now()).format("YYYY-MM-DD"),
                    payment_flag,
                    selling_price,
                    offer_price,
                    ip_addr,
                    last_update: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                  //  transaction: t,
                },
              
            }).catch((err) => {
                return jsend(500, err.message)
            });
         
            /*res.send({ message: "Exam Created Success !!!" });
            await t.commit();*/
            if (created) {
                if (created.quest_type == 'AUTO') {
                    let automaticList = [];
                    automatic.forEach((list) => {
                        automaticList.push({
                            examid: exam.exam_id,
                            catid: list.maincategoryId,
                            subcatid: list.subcategoryId,
                            sectid: 0,
                            noofquestions: list.noofquest,
                            questionlevel: exam.exam_level,
                            activestatus: 'Y',
                            createdby: req.user.id,
                            createdtimestamp: moment(Date.now()).format("YYYY-MM-DD")
                        });
                    });
                    // 2. tbl__automatic_question_details insert
                    let automaticdata = await AutomaticQuestionDetails.create(automaticList, {
                        transaction: t,
                    }).catch((err) => {
                        return jsend(500,err.message);
                    });
                  
                    let examquestionslist = [];
                    let check = 0;
                    for (const automatic of automaticdata) {
                        // const [questionsdata] = await db.sequelize.query(`SELECT * from tbl__question WHERE cat_id = ${automatic.catid} 
                        // and sub_id = ${automatic.subcatid} and quest_status = 'Y' and quest_level in (${automatic.questionlevel}) and qid
                        // not in (SELECT qid from tbl__examquestions 
                        //     WHERE exam_id = ${automatic.examid} and sect_id = 0 and exam_queststatus = 'Y' ) 
                        //     ORDER BY RAND() LIMIT ${automatic.noofquestions}`,
                        //     { transaction: t }
                        // );
                        
  const questionsdata = await Question.aggregate([ 
                {$limit:300},                   
                { "$match":{  
                  cat_id:automatic.catid,
                  sub_id:automatic.subcatid,
                  quest_status:"Y",
                  quest_level:automatic.questionlevel,
                  pid:0,
            }},
          ])
          console.log(questionsdata)
            const [ examquestionslist] = await ExamQuestions.aggregate([ 
              {$limit:300},                   
              { "$match":{  
                exam_id:automatic.examid,
                exam_queststatus:"Y",
                sect_id:0,
          }},

            {$sort:{
              "automatic.noofquestions":1,//ORDER BY RAND() LIMIT ${automatic.noofquestions}
           }},
               
             {$project:{
              Question:1,
                _id:0 ,count:{$sum:1} }}                 
                  ])
                       // console.log(questionsdata);
                        //console.log(questionsdata.length);
                        //console.log(automatic.noofquestions);
                        if (questionsdata.length != automatic.noofquesgetTestTypestions) {
                            check = 1;
                        }
                        console.log(check);
                        if (check == 0) {
                            questionsdata.forEach((question) => {
                                examquestionslist.push({
                                    exam_id: automatic.examid,
                                    exam_cat: exam.exam_cat,
                                    exam_subcat: exam.exam_sub,
                                    sect_id: automatic.sectid,
                                    exam_name: exam.exam_name,
                                    exam_code: exam.exam_code,
                                    quest_type: exam.quest_type,
                                    quest_assigned_type: req.payload.user.logintype,
                                    quest_assigned_id: req.payload.user.id,
                                    quest_assigned_name: req.payload.user.username,
                                    qid: question.qid,
                                    cat_id: question.cat_id,
                                    sub_id: question.sub_id,
                                    q_type: question.q_type,
                                    question: question.question,
                                    quest_desc: question.quest_desc,
                                    opt_type1: question.opt_type1,
                                    opt_type2: question.opt_type2,
                                    opt_type3: question.opt_type3,
                                    opt_type4: question.opt_type4,
                                    opt_type5: question.opt_type5,
                                    opt_1: question.opt_1,
                                    opt_2: question.opt_2,
                                    opt_3: question.opt_3,
                                    opt_4: question.opt_4,
                                    opt_5: question.opt_5,
                                    crt_ans: question.crt_ans,
                                    quest_level: question.quest_level,
                                    exam_questpos: "1",
                                    exam_queststatus: "Y",
                                    exam_questadd_date: moment(Date.now()).format( "YYYY-MM-DD HH:mm:ss"),
                                    ip_addr: ip_addr,
                                    last_update: moment(Date.now()).format( "YYYY-MM-DD HH:mm:ss" ),
                                });
                            })
                            console.log(examquestionslist);
                        }
                    }
                    console.log('test');
                    //if (examquestionslist.length > 0) {
                    await ExamQuestions.create(examquestionslist, 
                    ).catch((err) => {
                       return jsend(404,err.message);
                    });
                }
                return({ message: "Common Exam Created Success !!!",created });
            } else {
                return(500,`${exam_code} - Exam Code Already Exists`);
            }
        } catch (error) {
           // await t.rollback();
           // return({ message: "Exam Code already exists" });
            logger.error(`Error at Create Common Exam : ${error.message}`);
            return jsend(500,error.message);
        }
    },
    // 6. Create Bank Exam
    createBankExam: async (req, res, next) => {
      //  const t = await db.sequelize.transaction();
        try {
    const { exam_cat, exam_sub, exam_sub_sub, exam_name, exam_slug, assign_test_type, exam_type, exam_code,
            exam_level, sect_cutoff, sect_timing, tot_questions, tot_mark,mark_perquest, neg_markquest,
            total_time, quest_type, exam_type_cat, exam_type_id, exam_pos,payment_flag, selling_price,
             offer_price, ip_addr, sections, } = req.payload;

     if ( !exam_cat ||  !exam_sub || !exam_sub_sub ||  !exam_name ||  !exam_slug || !assign_test_type ||
          !exam_type || !exam_code || !exam_level || !sect_cutoff ||!sect_timing || !tot_questions ||
          !tot_mark || !mark_perquest || !neg_markquest || !total_time || !quest_type || !exam_type_cat ||
          !exam_type_id || !exam_pos || !ip_addr || !sections
            )
            return jsend(400, "Please send valid request data");
            const [exam, created] = await Exams.findOrCreate({
              exam_code, exam_status: { $ne: "D"  },
                defaults: {
                    exam_cat,
                    exam_sub,
                    exam_sub_sub,
                    exam_name,
                    exam_slug,
                    assign_test_type,
                    exam_type,
                    exam_code,
                    exam_level,
                    sect_cutoff,
                    sect_timing,
                    tot_questions,
                    tot_mark,
                    mark_perquest,
                    neg_markquest,
                    total_time,
                    quest_type,
                    exam_type_cat,
                    exam_type_id,
                    exam_pos,
                    exam_status: "W",
                    exam_add_type: "S",
                    exam_add_id: req.user.id,
                    exam_add_name: req.user.username,
                    exam_date: moment(Date.now()).format("YYYY-MM-DD"),
                    ip_addr,
                    payment_flag,
                    selling_price,
                    offer_price,
                    last_update: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    transaction: t,
                },
            }).catch((err) => {
                return jsend(500, err.message)
            });
            if (created) {
                let examSectionsList = [];
                sections.forEach((list) => {
                    examSectionsList.push({
                        exam_id: exam.exam_id,
                        main_cat: exam.exam_sub,
                        sub_cat: exam.exam_sub_sub,
                        menu_title: list.menu_title,
                        no_ofquest: list.no_ofquest,
                        mark_perquest: list.mark_perquest,
                        tot_marks: list.tot_marks,
                        neg_mark: list.neg_mark,
                        cut_off: list.cut_off,
                        sect_time: list.sect_time,
                        sect_date: moment(Date.now()).format("YYYY-MM-DD"),
                        lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    });
                });
                // 2. tbl__exam_sectdetails insert
                let bulkdata = await ExamSectionDetails.create(examSectionsList, {
                    transaction: t,
                }).catch((err) => {
                    return jsend(500, err.message)
                });
                console.log(bulkdata);
                if (quest_type == 'AUTO') {
                    let automaticlist = [];
                    let increment = 0;
                    if (bulkdata) {
                        bulkdata.forEach((data) => {
                            let questionbank = sections[increment].questionbank;
                            for (let i = 0; i < questionbank.length; i++) {
                                automaticlist.push({
                                    examid: exam.exam_id,
                                    sectid: data.sect_id,
                                    catid: questionbank[i].maincategoryId,
                                    subcatid: questionbank[i].subcategoryId,
                                    noofquestions: questionbank[i].noofquest,
                                    questionlevel: exam.exam_level,
                                    activestatus: 'Y',
                                    createdby: req.payload.user.id,
                                    createdtimestamp: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
                                })
                            }
                            increment = increment + 1;
                        });
                        let automaticdata = await AutomaticQuestionDetails.create(automaticlist, {
                            transaction: t,
                        }).catch((err) => {
                            return jsend(500, err.message)
                        });

                        let examquestionslist = [];
                        let check = 0;
                        for (const automatic of automaticdata) {
                      const [questionsdata] = await db.sequelize.query(
                         `SELECT * from tbl__question WHERE cat_id = ${automatic.catid} 
                        and sub_id = ${automatic.subcatid} and quest_status = 'Y' and quest_level in (${automatic.questionlevel}) and qid
                        not in (SELECT qid from tbl__examquestions 
                            WHERE exam_id = ${automatic.examid} and sect_id = ${automatic.sectid} and exam_queststatus = 'Y' ) 
                            ORDER BY RAND() LIMIT ${automatic.noofquestions}`,
                                { transaction: t }
                            );
                            console.log(questionsdata);
                            console.log(questionsdata.length);
                            console.log(automatic.noofquestions);
                            if (questionsdata.length != automatic.noofquestions) {
                                check = 1;
                            }
                            console.log(check);
                            if (check == 0) {
                                questionsdata.forEach((question) => {
                                    examquestionslist.push({
                                        exam_id: automatic.examid,
                                        exam_cat: exam.exam_cat,
                                        exam_subcat: exam.exam_sub,
                                        sect_id: automatic.sectid,
                                        exam_name: exam.exam_name,
                                        exam_code: exam.exam_code,
                                        quest_type: exam.quest_type,
                                        quest_assigned_type: req.payload.user.logintype,
                                        quest_assigned_id: req.payload.user.id,
                                        quest_assigned_name: req.payload.user.username,
                                        qid: question.qid,
                                        cat_id: question.cat_id,
                                        sub_id: question.sub_id,
                                        q_type: question.q_type,
                                        question: question.question,
                                        quest_desc: question.quest_desc,
                                        opt_type1: question.opt_type1,
                                        opt_type2: question.opt_type2,
                                        opt_type3: question.opt_type3,
                                        opt_type4: question.opt_type4,
                                        opt_type5: question.opt_type5,
                                        opt_1: question.opt_1,
                                        opt_2: question.opt_2,
                                        opt_3: question.opt_3,
                                        opt_4: question.opt_4,
                                        opt_5: question.opt_5,
                                        crt_ans: question.crt_ans,
                                        quest_level: question.quest_level,
                                        exam_questpos: "1",
                                        exam_queststatus: "Y",
                                        exam_questadd_date: moment(Date.now()).format(
                                            "YYYY-MM-DD HH:mm:ss"
                                        ),
                                        ip_addr: ip_addr,
                                        last_update: moment(Date.now()).format(
                                            "YYYY-MM-DD HH:mm:ss"
                                        ),
                                    });
                                })
                                console.log(examquestionslist);
                            }
                        }
                        console.log('test');
                        //if (examquestionslist.length > 0) {
                        await ExamQuestions.bulkCreate(examquestionslist, {
                            transaction: t,
                        }).catch((err) => {
                            return jsend(500, err.message)
                        });
                        /*}
                        else{
                            console.log("no sufficient questions");
                        }*/

                    }
                }

                return({ message: "Bank Exam Created Success !!!" });
            } else {
                throw createError.Conflict(`${exam_code} - Exam Code Already Exists`);
            }

            await t.commit();
        } catch (error) {
            await t.rollback();
            logger.error(`Error at Create Bank Exam : ${error.message}`);
            return(error);
        }
    },
    // 7. Update Exam
    updateExamById: async (req, res, next) => {
        //const t = await db.sequelize.transaction();
        try {
            const { id } = req.params;

     const { exam_cat, exam_sub,exam_sub_sub, exam_name, exam_slug, assign_test_type, exam_type, exam_code,
             exam_level, sect_cutoff, sect_timing, tot_questions,  tot_mark, mark_perquest, neg_markquest,
             total_time,quest_type, exam_type_cat, exam_type_id, exam_pos,  payment_flag, selling_price,
             offer_price, ip_addr, } = req.payload;
             console.log(req.payload);
             if (
             !exam_cat || !exam_sub || !exam_sub_sub ||   !exam_name || !exam_slug || !assign_test_type ||
             !exam_type ||!exam_code || !exam_level || !sect_cutoff ||!sect_timing ||!tot_questions ||
             !tot_mark ||!mark_perquest || !total_time ||!quest_type ||!exam_type_cat || !exam_type_id ||
             !ip_addr
            )
            return jsend(400, "Please send valid request data");
         const Exam =  await Exams.findOneAndUpdate( { exam_id: id } ,
                {
                    exam_cat,
                    exam_sub,
                    exam_sub_sub,
                    exam_name,
                    exam_slug,
                    assign_test_type,
                    exam_type,
                    exam_code,
                    exam_level,
                    sect_cutoff,
                    sect_timing,
                    tot_questions,
                    tot_mark,
                    mark_perquest,
                    neg_markquest,
                    total_time,
                    quest_type,
                    exam_type_cat,
                    exam_type_id,
                    exam_pos,
                    exam_status: "W",
                    exam_add_type: "S",
                   // exam_add_id: req.payload.user.id,
                   // exam_add_name: req.payload.user.username,
                    exam_date: moment(Date.now()).format("YYYY-MM-DD"),
                    payment_flag,
                    selling_price,
                    offer_price,
                    ip_addr,
                    last_update: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                },
               ) .catch((err) => {
                return jsend(404, err.message);
            });
                if(Exam){
                    return jsend(200, "data received Successfully",
                        { message: "Updated Success" })
                }else{
                    return jsend(500, "Please try again after sometime")
                }
            // ).catch((err) => {
            //     return jsend(500, err.message)
            // });
            // return({ message: "Exam Updated Success !!!" });
            // await t.commit();
        } catch (error) {
            await t.rollback();
            logger.error(`Error at Update Common Exam : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 8. Update Bank Exam
    updateBankExamById: async (req, res, next) => {
        //const t = await db.sequelize.transaction();
        try {
            const { id } = req.params;
            
     const { exam_cat, exam_sub, exam_sub_sub,exam_name, exam_slug,assign_test_type,exam_type,exam_code,
         exam_level, sect_cutoff, sect_timing, tot_questions, tot_mark, mark_perquest, neg_markquest, 
         total_time,quest_type,exam_type_cat, exam_type_id, exam_pos, payment_flag,selling_price, offer_price,
         ip_addr, sections, } = req.payload;
         if (
             !exam_cat || !exam_sub || !exam_sub_sub || !exam_name || !exam_slug || !assign_test_type ||
             !exam_type || !exam_code || !exam_level || !sect_cutoff || !sect_timing || !tot_questions ||
             !tot_mark || !mark_perquest || !neg_markquest || !total_time ||!quest_type ||!exam_type_cat ||
             !exam_type_id || !ip_addr ||!sections
            )
            return jsend(400, "Please send valid request data");
        const exams =  await Exams.findOneAndUpdate( { 
                    exam_id: id ,
                    exam_cat,
                    exam_sub,
                    exam_sub_sub,
                    exam_name,
                    exam_slug,
                    assign_test_type,
                    exam_type,
                    exam_code,
                    exam_level,
                    sect_cutoff,
                    sect_timing,
                    tot_questions,
                    tot_mark,
                    mark_perquest,
                    neg_markquest,
                    total_time,
                    quest_type,
                    exam_type_cat,
                    exam_type_id,
                    exam_pos,
                    exam_status: "W",
                    exam_add_type: "S",
                 //   exam_add_id: req.payload.user.id,
                   // exam_add_name: req.payload.user.username,
                    exam_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    payment_flag,
                    selling_price,
                    offer_price,
                    ip_addr,
                    last_update: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                },
               
               // { transaction: t }
            ).catch((err) => {
                return jsend(500, err.message)
            });
            let exam = await Exams.findOne({
                  exam_id: id ,
            });
            console.log(exam);
            console.log(exam.exam_id);

            let examSectionsList = [];
        //    sections.forEach((list) => {
                examSectionsList.push(
                    {
                    exam_id: id,
                    main_cat: "0",
                    sub_cat: "0",
                 //   menu_title: list.menu_title,
                 //   no_ofquest: list.no_ofquest,
                //    mark_perquest: list.mark_perquest,
                  //  tot_marks: list.tot_marks,
                 //   neg_mark: list.neg_mark,
               ///     cut_off: list.cut_off,
                 //   sect_time: list.sect_time,
                    sect_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
              //  });
       });
            await ExamSectionDetails.create( { exam_id: id } )
            // 3. tbl__exam_sectdetails insert
            let bulkdata = await ExamSectionDetails.create(examSectionsList, {
               // transaction: t,
            }).catch((err) => {
                return jsend(500, err.message)
            });
            console.log(bulkdata);
            if (quest_type == 'AUTO') {
                let automaticlist = [];
                let increment = 0;
                if (bulkdata) {
                //    bulkdata.forEach((data) => {
                        let questionbank = sections[increment].questionbank;
                        for (let i = 0; i < questionbank.length; i++) {
                            automaticlist.push({
                                examid: id,
                                sectid: data.sect_id,
                                catid: questionbank[i].maincategoryId,
                                subcatid: questionbank[i].subcategoryId,
                                noofquestions: questionbank[i].noofquest,
                                questionlevel: exam.exam_level,
                                activestatus: 'Y',
                                createdby: req.payload.user.id,
                                createdtimestamp: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
                            })
                        }
                        increment = increment + 1;
                //    });
                    let automaticdata = await AutomaticQuestionDetails.create(automaticlist, {
                        transaction: t,
                    }).catch((err) => {
                        return jsend(500, err.message)
                    });

                    let examquestionslist = [];
                    let check = 0;
                    for (const automatic of automaticdata) {
                    //     const [questionsdata] = await db.sequelize.query(`SELECT * from tbl__question WHERE cat_id = ${automatic.catid} 
                    // and sub_id = ${automatic.subcatid} and quest_level in (${automatic.questionlevel}) and qid
                    // not in (SELECT qid from tbl__examquestions 
                    //     WHERE exam_id = ${automatic.examid} and sect_id = ${automatic.sectid} and exam_queststatus = 'Y') 
                    //     ORDER BY RAND() LIMIT ${automatic.noofquestions}`,
                    //         { transaction: t }
                    //     );
                    const [questionsdata] = await Question.aggregate([ 
                        {$limit:300},                   
                        { "$match":{  
                          cat_id:automatic.catid,
                          sub_id:automatic.subcatid,
                          quest_level:automatic.questionlevel
                    }},
                    { $sort: { "automatic.noofquestions": 1 } }
                  ])
                  .catch((err) => {
                    return jsend(500, "Please try again after sometime")
                  });
                  await ExamQuestions.aggregate([ 
                    {$limit:300},                   
                    { "$match":{  
                      exam_id:automatic.examid,
                      sect_id:automatic.sectid,
                      exam_queststatus:"Y"
                }},
                { $sort: { "automatic.noofquestions": 1 } }
              ])
              .catch((err) => {
                return jsend(500, "Please try again after sometime")
              });
                        console.log(questionsdata);
                        console.log(questionsdata.length);
                        console.log(automatic.noofquestions);
                        if (questionsdata.length != automatic.noofquestions) {
                            check = 1;
                        }
                        console.log(check);
                        if (check == 0) {
                            //questionsdata.forEach((question) => {
                                examquestionslist.push({
                                    exam_id: automatic.examid,
                                    exam_cat: exam.exam_cat,
                                    exam_subcat: exam.exam_sub,
                                    sect_id: automatic.sectid,
                                    exam_name: exam.exam_name,
                                    exam_code: exam.exam_code,
                                    quest_type: exam.quest_type,
                               //     quest_assigned_type: req.user.logintype,
                                //    quest_assigned_id: req.user.id,
                                //    quest_assigned_name: req.user.username,
                                    qid: question.qid,
                                    cat_id: question.cat_id,
                                    sub_id: question.sub_id,
                                    q_type: question.q_type,
                                    question: question.question,
                                    quest_desc: question.quest_desc,
                                    opt_type1: question.opt_type1,
                                    opt_type2: question.opt_type2,
                                    opt_type3: question.opt_type3,
                                    opt_type4: question.opt_type4,
                                    opt_type5: question.opt_type5,
                                    opt_1: question.opt_1,
                                    opt_2: question.opt_2,
                                    opt_3: question.opt_3,
                                    opt_4: question.opt_4,
                                    opt_5: question.opt_5,
                                    crt_ans: question.crt_ans,
                                    quest_level: question.quest_level,
                                    exam_questpos: "1",
                                    exam_queststatus: "Y",
                                    exam_questadd_date: moment(Date.now()).format(
                                        "YYYY-MM-DD HH:mm:ss"
                                    ),
                                    ip_addr: ip_addr,
                                    last_update: moment(Date.now()).format(
                                        "YYYY-MM-DD HH:mm:ss"
                                    ),
                                });
                       //     })
                            console.log(examquestionslist);
                        }
                    }
                    console.log('test');
                    //if (examquestionslist.length > 0) {
                    await ExamQuestions.create(examquestionslist, {
                        transaction: t,
                    }).catch((err) => {
                        return jsend(500, err.message)
                    });
                    /*}
                    else{
                        console.log("no sufficient questions");
                    }*/

                }
            }

            return jsend(200, "data received Successfully",{ message: "Exam Updated Success !!!" ,exams});
          //  await t.commit();
        } catch (error) {
          //  await t.rollback();
            logger.error(`Error at Update Bank Exam : ${error.message}`);
            return jsend(500, error.message)
        }
    },
     // 9. Update Sectional Exam
     updateSectionalExamById: async (req, res, next) => {
      //  const t = await db.sequelize.transaction();
        try {
            const { id } = req.params;
     const {
         exam_cat, exam_sub, exam_sub_sub,exam_name, exam_slug,assign_test_type,exam_type, exam_code,
         exam_level,sect_cutoff, sect_timing, tot_questions, tot_mark,mark_perquest,neg_markquest,
         total_time,quest_type, exam_type_cat, exam_type_id,exam_pos,payment_flag,selling_price,
         offer_price, ip_addr,sections,startDate,endDate } = req.payload;
         if (
          !exam_cat || !exam_sub ||!exam_sub_sub ||!exam_name || !exam_slug ||!assign_test_type ||
          !exam_type ||!exam_code ||!exam_level || !sect_cutoff ||!sect_timing ||!tot_questions ||
          !tot_mark ||!mark_perquest || !neg_markquest ||!total_time || !quest_type ||!exam_type_cat ||
          !exam_type_id || !ip_addr ||!sections
            )
            return jsend(400, "Please send valid request data");
            await Exams.findOneAndUpdate({exam_id: id  },
                {
                    exam_cat,
                    exam_sub,
                    exam_sub_sub,
                    exam_name,
                    exam_slug,
                    assign_test_type,
                    exam_type,
                    exam_code,
                    exam_level,
                    sect_cutoff,
                    sect_timing,
                    tot_questions,
                    tot_mark,
                    mark_perquest,
                    neg_markquest,
                    total_time,
                    quest_type,
                    exam_type_cat,
                    exam_type_id,
                    exam_pos,
                    exam_status: "W",
                    exam_add_type: "S",
                    exam_add_id: req.user.id,
                    exam_add_name: req.user.username,
                    exam_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    payment_flag,
                    selling_price,
                    offer_price,
                    ip_addr,
                    startDate,
                    endDate,
                    last_update: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                },
                //{ transaction: t }
            ).catch((err) => {
                return jsend(400, "Please send valid request data");
            });

            let exam = await Exams.findOne({
               exam_id: id ,
            });

            let old_sections = sections.filter(s => s.sect_id );
            let new_sections = sections.filter(s => !s.sect_id );
            let examSectionsList = [];
            new_sections.forEach((list) => {
                examSectionsList.push({
                    exam_id: id,
                    main_cat: "0",
                    sub_cat: "0",
                    menu_title: list.menu_title,
                    no_ofquest: list.no_ofquest,
                    mark_perquest: list.mark_perquest,
                    tot_marks: list.tot_marks,
                    neg_mark: list.neg_mark,
                    ques_ans: list.ques_ans,
                    cut_off: list.cut_off,
                    sect_time: list.sect_time,
                    sect_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                });
            });

            old_sections.forEach( async (list) => {
                let obj = {
                    exam_id: id,
                    main_cat: "0",
                    sub_cat: "0",
                    menu_title: list.menu_title,
                    no_ofquest: list.no_ofquest,
                    mark_perquest: list.mark_perquest,
                    tot_marks: list.tot_marks,
                    neg_mark: list.neg_mark,
                    ques_ans: d_ques_ans,
                    cut_off: list.cut_off,
                    sect_time: list.sect_time,
                    sect_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                };
                await ExamSectionDetails.findOneAndUpdate(
                    obj,
                    {  sect_id: list.sect_id  },
                  //  { transaction: t }
                )
            });
            
            let sect_ids = _.pluck(old_sections,'sect_id');
            await ExamSectionDetails.destroy({  qty : { $nin: sect_ids },
                 exam_id : id })
            // 3. tbl__exam_sectdetails insert
            let bulkdata = await ExamSectionDetails.create(examSectionsList, {
               // transaction: t,
            }).catch((err) => {
                return jsend(400, "Please send valid request data");
            });
            if (quest_type == 'AUTO') {
                let automaticlist = [];
                let increment = 0;
                if (bulkdata) {
                    bulkdata.forEach((data) => {
                        let questionbank = sections[increment].questionbank;
                        for (let i = 0; i < questionbank.length; i++) {
                            automaticlist.push({         
                                examid: id,
                                sectid: data.sect_id,
                                catid: questionbank[i].maincategoryId,
                                subcatid: questionbank[i].subcategoryId,
                                noofquestions: questionbank[i].noofquest,
                                questionlevel: exam.exam_level,
                                activestatus: 'Y',
                                createdby: req.user.id,
                                createdtimestamp: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
                            })
                        }
                        increment = increment + 1;
                    });
                    let automaticdata = await AutomaticQuestionDetails.bulkCreate(automaticlist, {
                        //transaction: t,
                    }).catch((err) => {
                        return jsend(400, "Please send valid request data");
                    });

                    let examquestionslist = [];
                    let check = 0;
                    for (const automatic of automaticdata) {
                    //     const [questionsdata] = await db.sequelize.query(`SELECT * from tbl__question WHERE cat_id = ${automatic.catid} 
                    // and sub_id = ${automatic.subcatid} and quest_level in (${automatic.questionlevel}) and qid
                    // not in (SELECT qid from tbl__examquestions 
                    //     WHERE exam_id = ${automatic.examid} and sect_id = ${automatic.sectid} and exam_queststatus = 'Y') 
                    //     ORDER BY RAND() LIMIT ${automatic.noofquestions}`,
                    //         { transaction: t }
                    //     );
                         const [questionsdata] = await Question.aggregate([ 
                        {$limit:300},                   
                        { "$match":{  
                          cat_id:automatic.catid,
                          sub_id:automatic.subcatid,
                          quest_level:automatic.questionlevel
                    }},
                    { $sort: { "automatic.noofquestions": 1 } }
                  ])
                  .catch((err) => {
                    return jsend(500, "Please try again after sometime")
                  });
                  await ExamQuestions.aggregate([ 
                    {$limit:300},                   
                    { "$match":{  
                      exam_id:automatic.examid,
                      sect_id:automatic.sectid,
                      exam_queststatus:"Y"
                }},
                { $sort: { "automatic.noofquestions": 1 } }
              ])
              .catch((err) => {
                return jsend(500, "Please try again after sometime")
              });
             
                        if (questionsdata.length != automatic.noofquestions) {
                            check = 1;
                        }
                        console.log(check);
                        if (check == 0) {
                            questionsdata.forEach((question) => {
                                examquestionslist.push({
                                    exam_id: automatic.examid,
                                    exam_cat: exam.exam_cat,
                                    exam_subcat: exam.exam_sub,
                                    sect_id: automatic.sectid,
                                    exam_name: exam.exam_name,
                                    exam_code: exam.exam_code,
                                    quest_type: exam.quest_type,
                                    quest_assigned_type: req.user.logintype,
                                    quest_assigned_id: req.user.id,
                                    quest_assigned_name: req.user.username,
                                    qid: question.qid,
                                    cat_id: question.cat_id,
                                    sub_id: question.sub_id,
                                    q_type: question.q_type,
                                    question: question.question,
                                    quest_desc: question.quest_desc,
                                    opt_type1: question.opt_type1,
                                    opt_type2: question.opt_type2,
                                    opt_type3: question.opt_type3,
                                    opt_type4: question.opt_type4,
                                    opt_type5: question.opt_type5,
                                    opt_1: question.opt_1,
                                    opt_2: question.opt_2,
                                    opt_3: question.opt_3,
                                    opt_4: question.opt_4,
                                    opt_5: question.opt_5,
                                    crt_ans: question.crt_ans,
                                    quest_level: question.quest_level,
                                    exam_questpos: "1",
                                    exam_queststatus: "Y",
                                    exam_questadd_date: moment(Date.now()).format(
                                        "YYYY-MM-DD HH:mm:ss"
                                    ),
                                    ip_addr: ip_addr,
                                    last_update: moment(Date.now()).format(
                                        "YYYY-MM-DD HH:mm:ss"
                                    ),
                                });
                            })
                            console.log(examquestionslist);
                        }
                    }
                    console.log('test');
                    //if (examquestionslist.length > 0) {
                    await ExamQuestions.bulkCreate(examquestionslist, {
                        transaction: t,
                    }).catch((err) => {
                        return jsend(400, "Please send valid request data");
                    });
                    /*}
                    else{
                        console.log("no sufficient questions");
                    }*/
                }
            }
            return({ message: "Exam Updated Success !!!" });
           // await t.commit();
        } catch (error) {
           // await t.rollback();
            logger.error(`Error at Update Bank Exam : ${error.message}`);
            return jsend(500,error.message);
        }
    },
    // 10. Update Exam Status 'Inactive / Active / Delete'
    updateStatusById: async (req, res, next) => {
        try {
            const { exam_id, status } = req.payload;
            if (!exam_id || !status) return jsend(400, "Please send valid request data");
            const result =   await Exams.findOneAndUpdate( 
                    { exam_id: exam_id,
                   exam_status: status }
                ).catch((err) => {
                    return jsend(500,err.message);
                });

                
           if(result){
            return jsend(200, "data received Successfully",
            { message: "Update Success !!!",result })
           }else{
            return jsend(500, "Please try again after sometime" )
           }
        } catch (error) {
            logger.error(`Error at Update Exam Status : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 11. Get Previous Year
    getPreviousYear: async (req, res, next) => {
        try {
            let { exam_cat, exam_sub } = req.payload;
            if (!exam_cat || !exam_sub)return jsend(400, "Please send valid request data");
            const  rows  = await Exams.find({
                    exam_type: "C",
                    exam_cat: exam_cat,
                    exam_sub: exam_sub,
                    exam_status: "Y",
            }).sort({ exam_id: 1 });
            if (!rows) {
                return jsend(404,"Previous year question Not Found !!!");
        }else{
            const count = rows.length;
            return jsend(200, "data received Successfully",
            { count, Exam: rows });
        }
        } catch (error) {
            logger.error(`Error at Get Previous Year : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 12. Get Test Types
    getTestTypes: async (req, res, next) => {
        try {
            let { sub_cat_id } = req.params;
            // const [category, metadata] = await db.sequelize.query(
            //     `select * from tbl__examtypes where extype_id not in (
            //         select exam_type_id from tbl__exam 
            //          where exam_type_cat='T'  AND assign_test_type ='D' AND exam_status !='D'
            //          and exam_sub_sub=?)
            //          and exa_cat_id=? and extype_status='Y' order by extype_id asc
            // `,
            //     { replacements: [sub_cat_id, sub_cat_id] }
            // );
            
  const category = await ExamType.aggregate([ 
                {$limit:300},                   
                 { "$match":{  
                   extype_status:"Y",
                   exa_cat_id:sub_cat_id,
            }}, 
            { $sort: { "extype_id":-1 } },
             {$project:{
                extype_id:1,
                extest_type:1,_id:0,
                 count:{$sum:1} }} 
           ])
          const Exam = await Exams.aggregate([
            {$limit:300},                   
            { "$match":{  
               exam_type_cat:"T",
              assign_test_type:"D",//
             exam_status:{$ne:"D"},//!
               exam_sub_sub:sub_cat_id,
        }}, 
        {$project:{
            exam_type_id:1,
            exam_type_cat:1, _id:0,
             count:{$sum:1} }} 
                  
            ])
            if (!category) {
                return jsend(404,"Test types Not Found !!!");
            }else{
            return jsend(200, "data received Successfully",
            { count: category.length,category,ExamCount:Exam.length,Exam});
            }
        } catch (error) {
            logger.error(`Error at Get Test Types : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 13. GetChapters
    getChapters: async (req, res, next) => {
        try {
            let { sub_cat_id } = req.params;
            // const [category, metadata] = await db.sequelize.query(
            //     `select * from tbl__examchapters where chapt_id 
            //     not in (
            //     select exam_type_id from tbl__exam 
            //      where exam_type_cat='C'  AND assign_test_type ='D' AND exam_status !='D'
            //      and exam_sub_sub=?)
            //      and exa_cat_id=? and chapter_status='Y' order by chapt_id asc
            // `,
            //     { replacements: [sub_cat_id, sub_cat_id] }
            // );
  const category = await Examchapters.aggregate([ 
                {$limit:300},                   
                 { "$match":{  
                  chapter_status:"Y",
                  exa_cat_id:sub_cat_id,
            }}, 
                { $sort: { "chapt_id":-1 } }, 
            {
                $project: {
                    category: 1,
                    chapt_id:1,
                    _id:0 ,count:{$sum:1} 
                }
            }
        ])
           const Exam = await Exams.aggregate([
              
            {$limit:300},                   
            { "$match":{  
               exam_type_cat:"C",
              assign_test_type:"D",
            //   exam_status:{ $ne: "D" },
              exam_sub_sub:sub_cat_id,
        }}, 
        { $sort: { "exam_id":-1 } },
            ])
            if (!category) {
                return jsend(404,"chapters list Not Found !!!");
            }else{
                return jsend(200, "data received Successfully",
                { count: category.length, category,ExamCount:Exam.length,Exam });
            }
        } catch (error) {
            logger.error(`Error at Get Chapters : ${error.message}`);
            return jsend(500, error.message)
        }
    },
     // 14. GetTestTypesEdit
    getTestTypesEdit: async (req, res, next) => {
        try {
            let { sub_cat_id } = req.params;
            const category = await ExamType.aggregate([
            //     `select * from tbl__examtypes where 
            //           exa_cat_id=? and extype_status='Y' order by extype_id asc
            // `,
            //     { replacements: [sub_cat_id] }
                { "$match":{ 
                     exa_cat_id:sub_cat_id,
                    extype_status:"Y",
              }},
              {$sort:{"extype_id":-1}},
            ]);

            if (!category) {
                return jsend(404,"Test types Not Found !!!");
            }
            return jsend(200, "data received Successfully", 
                { count: category.length, category }
                );
        } catch (error) {
            logger.error(`Error at Get Test Types Edit : ${error.message}`);
            return jsend(500, error.message);
        }
    },
     // 15. GetChaptersEdit
    getChaptersEdit: async (req, res, next) => {
        try {
            let { sub_cat_id } = req.params;
            const [category, metadata] = await Examchapters.aggregate([
            //     `select * from tbl__examchapters where 
            //     exa_cat_id=? and chapter_status='Y' order by chapt_id asc
            // `,
            //     { replacements: [sub_cat_id] }
                { "$match":{  
                    exa_cat_id:sub_cat_id,
                    chapter_status:"Y",
              }},
              {$sort:{"chapt_id":-1}},
             ]);
            if (!category) {
                return jsend(404,"chapters list Not Found !!!");
            }
            return jsend(200, "data received Successfully", 
                { count: category.length, category }
                );
        } catch (error) {
            logger.error(`Error at Get Chapters Edit : ${error.message}`);
            return jsend(500, error.message);
            
        }
    },
    // 16. Get Exam Search Result
    getSearchResult: async (req, res, next) => {
        try {
     let { qType, difficulty, faculty, searchString, exam_cat, exam_sub, exam_sub_sub, status,
                examtype } = req.payload;

        if (qType == null ||  difficulty == null || faculty == null || searchString == null ||
            exam_cat == null || exam_sub == null || exam_sub_sub == null )
            return jsend(400, "Please send valid request data");

            if (!!searchString) searchString = `%${searchString}%`;

            if (qType != "" && difficulty == "" && faculty == "" && searchString == "") {
                conditions = `a.quest_type = '${qType}' AND`;
            } else if (qType != "" && difficulty != "" && faculty == "" && searchString == "") {
                conditions = `a.quest_type = '${qType}' AND  a.exam_level = '${difficulty}' AND`;
            } else if (qType != "" && difficulty != "" && faculty != "" && searchString == "") {
                conditions = `a.quest_type = '${qType}' AND  a.exam_level = '${difficulty}' AND a.quest_add_id = '${faculty}' AND`;
            } else if (qType != "" && difficulty != "" && faculty != "" && searchString != "") {
                conditions = `a.quest_type = '${qType}' AND  a.exam_level = '${difficulty}' AND a.quest_add_id = '${faculty}' AND a.question LIKE '${searchString}' AND`;
            } else if (qType == "" && difficulty != "" && faculty == "" && searchString == "") {
                conditions = `a.exam_level = '${difficulty}' AND`;
            } else if (qType == "" && difficulty == "" && faculty != "" && searchString == "") {
                conditions = `a.exam_add_id = '${faculty}' AND`;
            } else if (qType == "" && difficulty == "" && faculty == "" && searchString != "") {
                conditions = `a.exam_name LIKE '${searchString}' AND`;
            } else {
                conditions = ``;
            }

    //         const [exams, metadata] = await db.sequelize.query(
    //             `SELECT a.*,COUNT(b.exam_id) as totalassigned FROM tbl__exam as a 
    //             left join tbl__examquestions as b on a.exam_id=b.exam_id and b.exam_queststatus='Y'
           
    //             WHERE ${conditions} a.exam_cat = ${exam_cat} AND a.exam_sub = ${exam_sub}
    //              AND a.exam_sub_sub = ${exam_sub_sub} AND a.exam_status = '${status}' 
    //              AND a.exam_type = '${examtype}' 
    //              group by a.exam_id
    //         ORDER BY a.exam_id;`, 
    //   {  replacements: [ qType, difficulty, faculty,searchString,exam_cat,exam_sub, exam_sub_sub,  ], });
    const  exams = await Exams.aggregate([
            
        {
           "$match": {
             //${conditions}
              "exam_cat": exam_cat,
              "exam_sub": exam_sub,
              "exam_sub_sub":exam_sub_sub,
              "exam_type":examtype,
              "exam_status":status,
             // exam_queststatus:"Y"
           }
          },
        {
          '$lookup': {
            'from': "tbl__examquestions",
            'localField': 'exam_id',
            'foreignField': 'exam_id',
            'as': 'ExamData'
          }
        },
        { "$unwind": "$ExamData" },
            { $sort: { "exam_id": 1} },
        {
          $project: {
            exam_cat:1,exam_sub:1,exam_sub_sub:1,exam_status:1,exam_type:1,exam_queststatus:1,
            count: { $sum: 1 },
            totalassigned:"$ExamData.exam_id",
            }
        }
      ])
        .catch((err) => {
          return jsend(500, error.message);
        });
            if (!exams) {
                return({exam: "Not Found !!!" });
            }else{
            return({ count: exams.length, exams });
            }

            /*
            const { count, rows } = await db.Questions.findAndCountAll({
                where: {
                    [Op.or]: [
                        { quest_level: difficulty },
                        { quest_add_id: faculty },
                        { q_type: qType },
                        {
                            question: {
                                [Op.like]: searchString,
                            },
                        },
                    ],
                    quest_status: { [Op.ne]: "D" },
                },
            });
            if (count == 0) res.send({ count, exams: "Not Found !!!" });
            res.send({ count, exams: rows });
            */
        } catch (error) {
            logger.error(`Error at Get Exam Search Res : ${error.message}`);
            return jsend(500,error.message);
        }
    },
    // 17. GetSection
    getSection: async (req, res, next) => {
        try {
            const { exam_id } = req.params;
            if (exam_id == 0 || !exam_id)
             return jsend(400, "Please send valid request data");
            const  rows  = await ExamSectionDetails.find({
                // include: [
                //     {
                //         model: db.AutomaticQuestionDetails,
                //     },
                // ],
                    exam_id: exam_id,  
                   }).sort({ sect_id: 1 });

            if (!rows) {
                return jsend(404,"Exam Section Not Found !!!");
            }else{
            const count = rows.length;
          return jsend(200, "data received Successfully",{ count, Section: rows });
            }
        } catch (error) {
            logger.error(`Error at Get Section : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 18. Get All Exam Count Only
    getAllExamCount: async (req, res, next) => {
        try {
            const { type, status, exa_cat_id } = req.payload;
            if (!type || !status || !exa_cat_id)
              return jsend(400, "Please send valid request data");
            const count = await Exams.count({
                    exam_type: type,
                    exam_status: status,
                    exam_sub_sub: exa_cat_id,
               
            }).catch((err) => {
                return jsend(500, error.message)
            });
           // const count = rows.length;
           return jsend(200, "data received Successfully",{ count });
        } catch (error) {
            logger.error(`Error at Get All Exam Count Only : ${error.message}`);
            return jsend(500, error.message)
        }
    },
     // 19. moveExam
    moveExam: async (req, res, next) => {
        try {
            const { exam_id, exa_cat, exam_sub, exam_sub_sub } = req.payload;
            if (!exam_id || !exa_cat || !exam_sub || !exam_sub_sub)
            return jsend(400, "Please send valid request data");
            const   rows  = await Exams.find({
                    exam_id: exam_id
            }).catch((err) => {
                return jsend(400, "Please send valid request data");;
            });
            console.log(rows);
            if (!rows) return({ count, exams: "Not Found !!!" });
            if (rows) {
                await Exams.findOneAndUpdate(
                    {
                        exam_cat: exa_cat,
                        exam_sub,
                        exam_sub_sub,
                        last_update: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    },
                    { exam_id: exam_id } 
                ).catch((err) => {
                    return jsend(400, "Please send valid request data");
                });
                await ExamQuestions.findOneAndUpdate(
                    {
                        exam_cat: exa_cat,
                        exam_subcat: exam_sub,
                        last_update: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    },
                   { exam_id: exam_id, exam_queststatus: 'Y' } 
                ).catch((err) => {
                    return jsend(500, err.message)
                });
                return jsend(200, "data received Successfully",
                { message: "Exam Updated Success !!!" });
            }
            /*const [exams] = await db.sequelize.query(
                `SELECT * FROM tbl__exam where exam_id = ?`,
                {
                    replacements: [
                        exam_id
                    ],
                }
            );*/

            /*if (!rows) res.send({ count, exams: "Not Found !!!" });
            res.send({ rows });*/

        } catch (error) {
            logger.error(`Error at Get Exam Search Res : ${error.message}`);
            return jsend(500, error.message)
        }
    },
     // 20. GetAllAttendExam
    getAllAttendExam: async (req, res, next) => {
        try {
            const  rows  = await Examtakenlist.find({
                    exam_status: 'C'
            }).catch((err) => {
                return jsend(400, "Please send valid request data");
            });
            console.log(rows);
           
            if (!rows){
                return jsend(404,count,row.exams,":Not Found !!!" );
        }else{
             //const count = rows.length;
            return jsend(200, "data received Successfully",{ rows });
        }
        } catch (error) {
            logger.error(`Error at Get Exam By Id : ${error.message}`);
            return jsend(500, error.message)
        }
    },
     // 21. GetAllPaidExam
    getAllPaidExam: async (req, res, next) => {
        try {
            const  rows  = await OrderItems.find({
                    payment_status: 1,
                    order_type: 'Exam'
               
            }).catch((err) => {
                return jsend(500, err.message)
            });
            console.log(rows);
            if (!rows) {
                   
                return jsend(404, { count, exams: "Not Found !!!" });
        }else{
            const count = rows.length;
            return jsend(200, "data received Successfully",{ count,rows });
        }
        } catch (error) {
            logger.error(`Error at Get Exam By Id : ${error.message}`);
            return jsend(500, error.message)
        }
    },
     // 22. GetAutomaticRows
    getAutomaticRows: async (req, res, next) => {
        try {
            const { exam_id } = req.params;
            if (exam_id == 0 || !exam_id)  return jsend(400, "Please send valid request data");
            const rows  = await AutomaticQuestionDetails.find({
                    examid: exam_id,
            });
            if (!rows) {
                return jsend(404,"Exam Section Not Found !!!");
            }else{
            const count = rows.length;
            return jsend(200, "data received Successfully",
            { count, automaticquestions: rows });
            }
        } catch (error) {
            logger.error(`Error at Get Section : ${error.message}`);
            return jsend(500, error.message)
        }
    },
    // 23. CreateSectionalExam
    createSectionalExam: async (req, res, next) => {
        //  const t = await db.sequelize.transaction();
          var d_exam_type = "D";
       try {
           const { exam_cat, exam_sub,exam_sub_sub, exam_name, exam_slug, assign_test_type, exam_type,
                  exam_code, exam_level, sect_cutoff, sect_timing, tot_questions, tot_mark, mark_perquest,
                  neg_markquest, total_time, quest_type,exam_type_cat, exam_type_id, exam_pos, payment_flag,
                  selling_price,offer_price, ip_addr, sections,startDate, endDate } = req.payload;
  
       if (
            !exam_cat || !exam_sub || !exam_sub_sub || !exam_name || !exam_slug ||!assign_test_type ||
            !exam_type ||!exam_code || !exam_level || !sect_cutoff ||!sect_timing || !tot_questions ||
            !tot_mark || !mark_perquest || !neg_markquest ||!total_time ||!quest_type || !exam_type_cat ||
            !exam_type_id ||!exam_pos || !ip_addr || !sections )
            return jsend(400, "Please send valid request data");
  
              const exam = await Exams.create({
                   exam_code,
                    exam_status:{ $ne: "D" },
                  defaults: {
                      exam_cat,
                      exam_sub,
                      exam_sub_sub,
                      exam_name,
                      exam_slug,
                      assign_test_type,
                      exam_type:d_exam_type,
                      exam_code,
                      exam_level,
                      sect_cutoff,
                      sect_timing,
                      tot_questions,
                      tot_mark,
                      mark_perquest,
                      neg_markquest,
                      total_time,
                      quest_type,
                      exam_type_cat,
                      exam_type_id,
                      exam_pos,
                      exam_status: "W",
                      exam_add_type: "S",
                     // exam_add_id: req.user.id,
                    //  exam_add_name: req.user.username,
                      exam_date: moment(Date.now()).format("YYYY-MM-DD"),
                      ip_addr,
                      payment_flag,
                      selling_price,
                      offer_price,
                      last_update: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                     // transaction: t,
                      startDate,
                      endDate
                  },
              }).catch((err) => {
                  return jsend(400, "Please send valid request data");
              });
              if (exam) {
                  let examSectionsList = [];
                 // sections.forEach((list) => {
                      examSectionsList.push({
                          exam_id: exam.exam_id,
                          main_cat: exam.exam_sub,
                          sub_cat: exam.exam_sub_sub,
                       //   menu_title: list.menu_title,
                         // ques_ans:list.ques_ans,
                        //  no_ofquest: list.no_ofquest,
                       //   mark_perquest: list.mark_perquest,
                       //   tot_marks: list.tot_marks,
                        //  neg_mark: list.neg_mark,
                        //  cut_off: list.cut_off,
                         // sect_time: list.sect_time,
                          sect_date: moment(Date.now()).format("YYYY-MM-DD"),
                          lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                      });
                //  });
                  // 2. tbl__exam_sectdetails insert
                  let bulkdata = await ExamSectionDetails.create(examSectionsList, {
                     // transaction: t,
                  }).catch((err) => {
                      return jsend(400, "Please send valid request data",err.message);
                  });
                  if (quest_type == 'AUTO') {
                      let automaticlist = [];
                      let increment = 0;
                      if (bulkdata) {
                          bulkdata.forEach((data) => {
                              let questionbank = sections[increment].questionbank;
                              for (let i = 0; i < questionbank.length; i++) {
                                  automaticlist.push({
                                      examid: exam.exam_id,
                                      sectid: data.sect_id,
                                      catid: questionbank[i].maincategoryId,
                                      subcatid: questionbank[i].subcategoryId,
                                      noofquestions: questionbank[i].noofquest,
                                      questionlevel: exam.exam_level,
                                      activestatus: 'Y',
                                     // createdby: req.user.id,
                                      createdtimestamp: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
                                  })
                              }
                              increment = increment + 1;
                          });
                          let automaticdata = await AutomaticQuestionDetails.create(automaticlist, {
                             // transaction: t,
                          }).catch((err) => {
                              return jsend(400, "Please send valid request data");
                          });
  
                          let examquestionslist = [];
                          let check = 0;
                          for (const automatic of automaticdata) {
                          //     const [questionsdata] = await db.sequelize.query(`SELECT * from tbl__question WHERE cat_id = ${automatic.catid} 
                          // and sub_id = ${automatic.subcatid} and quest_status = 'Y' and quest_level in (${automatic.questionlevel}) and qid
                          // not in (SELECT qid from tbl__examquestions 
                          //     WHERE exam_id = ${automatic.examid} and sect_id = ${automatic.sectid} and exam_queststatus = 'Y' ) 
                          //     ORDER BY RAND() LIMIT ${automatic.noofquestions}`,
                          //         { transaction: t }
                          //     );
                          const  [questionsdata] = await Question.aggregate([
                              {
                                 "$match": {
                                  //   "cat_id": "automatic.catid",
                                    // sub_id:"automatic.subcatid",
                                  //   quest_level:automatic.questionlevel,
                                     quest_status:"Y"
                                     //qid:qid
                                 }
                                },
                        
                                //  { $sort: { "automatic.noofquestions": 1} },
                              {
                                $project: {
                                  count: { $sum: 1 },
                                  ExamData:"$ExamData",
                                  }
                              }
                            ])
                              .catch((err) => {
                                return jsend(500, error.message);
                              });
                              const  [ExamQuestionsdata] = await Examquestions .aggregate([
                                  {
                                     "$match": {
                                        // "exam_id": "automatic.examid",
                                         //"sect_id": "automatic.sectid",
                                         exam_queststatus:"Y"
                                     }
                                    },
                                  {
                                    $project: {
                                      count: { $sum: 1 },
                                      qid:"$qid",
                                      }
                                  }
                                ])
                                  .catch((err) => {
                                    return jsend(500, error.message);
                                  });
                              if (questionsdata.length != automatic.noofquestions) {
                                  check = 1;
                              }
                              console.log(check);
                              if (check == 0) {
                                  questionsdata.forEach((question) => {
                                      examquestionslist.push({
                                          exam_id: automatic.examid,
                                          exam_cat: exam.exam_cat,
                                          exam_subcat: exam.exam_sub,
                                          sect_id: automatic.sectid,
                                          exam_name: exam.exam_name,
                                          exam_code: exam.exam_code,
                                          quest_type: exam.quest_type,
                                          quest_assigned_type: req.user.logintype,
                                          quest_assigned_id: req.user.id,
                                          quest_assigned_name: req.user.username,
                                          qid: question.qid,
                                          cat_id: question.cat_id,
                                          sub_id: question.sub_id,
                                          q_type: question.q_type,
                                          question: question.question,
                                          quest_desc: question.quest_desc,
                                          opt_type1: question.opt_type1,
                                          opt_type2: question.opt_type2,
                                          opt_type3: question.opt_type3,
                                          opt_type4: question.opt_type4,
                                          opt_type5: question.opt_type5,
                                          opt_1: question.opt_1,
                                          opt_2: question.opt_2,
                                          opt_3: question.opt_3,
                                          opt_4: question.opt_4,
                                          opt_5: question.opt_5,
                                          crt_ans: question.crt_ans,
                                          quest_level: question.quest_level,
                                          exam_questpos: "1",
                                          exam_queststatus: "Y",
                                          exam_questadd_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss" ),
                                          ip_addr: ip_addr,
                                          last_update: moment(Date.now()).format( "YYYY-MM-DD HH:mm:ss"),
                                      });
                                  })
                                  console.log(examquestionslist);
                              }
                          }
                          await ExamQuestions.create(examquestionslist, {
                             // transaction: t,
                          }).catch((err) => {
                              return jsend(400, "Please send valid request data",err.message);
                          });
                      }
                  }
                  return({ message: "Sectional Exam Created Success !!!",exam });
              } else {
                  throw createError.Conflict(`${exam_code} - Exam Code Already Exists`);
              }
             // await t.commit();
          } catch (error) {
             // await t.rollback();
              logger.error(`Error at Create Bank Exam : ${error.message}`);
              return jsend(500,error.message);
          }
      },
};
