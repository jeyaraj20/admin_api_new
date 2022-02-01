"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const S3 = require("../lib/s3");
const mongoose = serviceLocator.get("mongoose"); 
const Notes = mongoose.model("tbl__notes");
const Examchapters = mongoose.model("tbl__examchapters");
const Videos = mongoose.model("tbl__videos");


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports = {
    // 1.  Get Chapeters and Notes count
    getChapters: async (req, res, next) => {
        const { masterId, mainId, subId, name, status, _start, _limit } = req.payload;
        let where = {};
        if (masterId) where.exmain_cat=masterId 
        if (mainId) where.exsub_cat=mainId 
        if (subId) where.exa_cat_id=subId 
        
        if (name) where.chapter_name={$regex: name, $options: 'i'}
        if (status) where.chapter_status=status;
        _start = _start ? Number(_start) : 0;
        _limit = _limit ? Number(_limit) : 10000;
        try {
            const activeCount =  await Examchapters.find({chapter_status:'Y'})
                
            const inActiveCount = await Examchapters.find({chapter_status:'N'})
               
            const count = await Examchapters.find(where)
           const formattedQuery=   [
            { '$lookup': {
                'from': "tbl__exam_category",
                'localField': 'exa_cat_id',
                'foreignField': 'exa_cat_id',
                'as': 'b'
              }},                      
               { "$unwind": "$b" },
               { '$lookup': {
                'from': "tbl__exam_category",
                'localField': 'exa_cat_id',
                'foreignField': 'exmain_cat',
                'as': 'c'
              }},                      
               { "$unwind": "$c" }, 
               { '$lookup': {
                'from': "tbl__exam_category",
                'localField': 'exa_cat_id',
                'foreignField': 'exsub_cat',
                'as': 'd'
              }},                      
               { "$unwind": "$d" },
               { '$lookup': {
                'from': "tbl__notes",
                'localField': 'chapterId',
                'foreignField': 'chapt_id',
                'as': 'e'
              }},                      
               { "$unwind": "$e" }, 
               {$skip:_start} ,
               {$limit:_limit},
               {$project:{
                Mastercategory:"$b.exa_cat_name",
                Maincategory:"$c.exa_cat_name",
                Subcategory:"$d.exa_cat_name",
                chapter_status:1,
                chapt_id:1,NotesCount:{$count:"$e.chapterId"}

               }},
               {
                $group: {
      
                  _id: { chapt_id: "$chapt_id", chapter_status: "$chapter_status" }  

                }
              } 
               
           ]
           if(Object.keys(where).length>0){
            formattedQuery.unshift({$match:where})
           }
           
               const chapters =Examchapters.aggregate(
                formattedQuery
               )
            if (!chapters) {
                return jsend (404,"Chapters Not Found !!!");
            }

            await asyncForEach(chapters, async (oneDoc) => {
                const videos = await Videos.find({chapterId:oneDoc.chapt_id})
                   
                oneDoc['VideosCount'] = videos.length;
            });

           return jsend(200,'Chapters fetched successfully.',{ count: count.length, chapters, activeCount: activeCount.length, inActiveCount: inActiveCount.length });
        } catch (error) {
            logger.error(`Error at Get All Active Chapters : ${error.message}`);
            return jsend(500,error.message)
        }
    },
    // 2. Get Notes
    get: async (req, res, next) => {
        const { chapterId } = req.params;
        if (!chapterId) return jsend(400, "Please send valid request data");
        try {
            const  rows  = await Notes.find({
             chapterId :chapterId
            });
            if (!rows) {
                return jsend(404,"Previous year question Not Found !!!");
        }else{
            const count = rows.length;
            return jsend(200,{message: 'Notes fetched successfully'},
            {  data: rows,count });
        }
        } catch (error) {
            return jsend(500,'Notes fetched failed.');
        }
    },
    // 3. Create Notes
    create: async (req, res) => {
        const {
            notesName, notesUrl, notesType, chapterId,notesPosition } = req.payload;
            const notesId = await Notes.count()
        if (notesName && notesUrl) {
            try {
             const note =  await Notes.create(
                    {
                        notesId: (notesId) ? Number(notesId) + 1 : 1,
                        notesName,
                        notesUrl,
                        notesType,
                        chapterId: Number(chapterId),
                        notesPosition: notesPosition ? Number(notesPosition) : 0,
                        createdBy: "123",//req.payload.user.userid,
                        notesStatus: 'Y'
                    }
                )
           
            .catch((err) => {
                return jsend(404,err.message);
            });
            if(note){
                return jsend(200, "data received Successfully", 
                { message: "Insert Success",note });
            }else{
                return jsend(500, "Please try again after sometime")
            }
        } catch (error) {
            logger.error(`Error at Create City : ${error.message}`);
            return jsend(500, error.message)
        }
    }
    },
    //  4.Update Notes
    update: async (req, res, next) => {
        const { notesId } = req.params;
        const { notesName, notesUrl, notesType, notesPosition, notesStatus } = req.payload;
        if (!notesId) return jsend(400, "Please send valid request data");
        try {
            const notes = await Notes.findOne({
                  chapterId:notesId
            });
            if (notes) {
                if (notesUrl !== notes.notesUrl) {
                    await S3.s3Delete([notes.notesUrl]);
                }
          const result =  await Notes.findOneAndUpdate(
                    { chapterId:notesId  },
                    {
                        notesName,
                        notesUrl,
                        notesType,
                        notesPosition,
                        notesStatus
                    }
           
            ) .catch((err) => {
                return jsend(404, err.message);
            });
                if(result){
                    return jsend(200, "data received Successfully",
                        { message: "Updated Success",result })
                }else{
                    return jsend(404, "Please try again after sometime")
                }
            }
        } catch (error) {
            return jsend(500, 'Notes fetched failed!');
        }
    },
    // 5. Delete Notes
    delete: async (req, res, next) => {
        const { notesId } = req.payload;
        if (!notesId)  return jsend(400, "Please send valid request data");
        try {
            const notes = await Notes.findOne(
                 {chapterId:notesId }
            );
            if (notes) { 
                // await S3.s3Delete([notes.notesUrl]);
                await Notes.deleteOne({
                    chapterId:notesId  
                });
                return({ statusCode: 200, message: 'Notes deleted successfully', notes});
            } else {
                return({ statusCode: 404, message: 'Notes Not Found!', });
            }
        } catch (error) {
            return jsend(500, 'Notes fetched failed!', error.message);
        }
    },
    // 6. GetFiles
    getFiles: async (req, res, next) => {
        const { notesId } = req.params;
        if (!notesId) return jsend(400, "Please send valid request data");
        try {
            const notes = await Notes.findOne({
                chapterId:notesId
   
       });
            if (notes) {
                //let file = await S3.getObject(notes.notesUrl);
                return jsend(200, "data received Successfully",
                    {notes});
        }else{
            return jsend(404,
                {message: 'error'},
        )}
        } catch (error) {
            return jsend(500,'Notes fetched failed.');
        }
    }}
