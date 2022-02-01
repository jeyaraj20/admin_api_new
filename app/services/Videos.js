"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const S3 = require("../lib/s3");
const mongoose = serviceLocator.get("mongoose"); 
const Videos =mongoose.model("tbl__videos")


// const createError = require("http-errors");
// const db = require("../Models");
// const vimeo = require("../helper/vimeo");
// const S3 = require("../helper/s3");

module.exports = {
    // 1.Get Videos
    get: async (req, res, next) => {
        const { chapterId, videosId } = req.query;
        let where = {};
        if (chapterId) where['chapterId'] = chapterId;
        if (videosId) where['videosId'] = videosId;
        try {
            const  rows  = await Videos.find({
                where: where
            });
            return ({ statusCode: 200, message: 'Videos fetched successfully', data: rows });
        } catch (error) {
            logger.error(`Videos fetched faied : ${error.message}`);
            return jsend(500, error.message)
           // return({ statusCode: 201, message: 'Videos fetched faied' });
        }
    },
    // 2. Create Videos
    create: async (req, res, next) => {
        try {
            const {
                videosName, videosDescription,
                chapterId, videosPosition, thumbnailUrl } = req.body;
            videosDescription = videosDescription ? videosDescription : '';
            if (videosName && req.file && chapterId && thumbnailUrl) {
                let result = await vimeo.uploadVideo(req.file, videosName, videosDescription);
                await Videos.create(
                    {
                        videosName,
                        videosUrl: result,
                        videosDescription,
                        chapterId: Number(chapterId),
                        videosPosition: videosPosition ? Number(videosPosition) : 0,
                        createdBy: req.payload.user.userid,
                        videosStatus: 'Y',
                        thumbnailUrl
                    }
                )
                io.emit('video-upload-status', 'success');
                return jsend({ statusCode: 200, message: 'Video created successfully' });
            } else {
                io.emit('video-upload-status', 'failed');
                return jsend({ statusCode: 201, message: 'Required fieldes missing' });
            }
        } catch (e) {
            io.emit('video-upload-status', 'failed');
            return jsend({ statusCode: 201, message: 'Video created faied' });
        }
    },
    // 3.Update Videos
    update: async (req, res, next) => {
        const { videosId } = req.params;
        const {
            videosName, videosDescription,videosPosition,
            videosStatus,videosUrl,thumbnailUrl} = req.payload;
        if (!videosId) return jsend(400, "Please send valid request data");
        try {
            const videos = await Videos.findOne({
              videosId
            });
            if (videos) {
                if (req.file) {
                    videosUrl = await vimeo.uploadVideo(req.file, videosName, videosDescription);
                    await vimeo.deleteVideo(videos.videosUrl);
                } else {
                    await vimeo.updateVideo(videos.videosUrl, videosName, videosDescription);
                }
                if( videos.thumbnailUrl && thumbnailUrl !== videos.thumbnailUrl){
                    await S3.s3Delete([videos.thumbnailUrl]);
                }
                await Videos.findOneAndUpdate({ videosId },
                    {
                        videosName,
                        videosDescription,
                        videosPosition,
                        videosStatus,
                        videosUrl,
                        thumbnailUrl
                    }
                )
                io.emit('video-update-status', 'success');
                return jsend({ statusCode: 200, message: 'Videos Updated successfully', });
            } else {
                io.emit('video-update-status', 'failed');
                return jsend({ statusCode: 404, message: 'Videos Not Found!', });
            }
        } catch (error) {
            io.emit('video-update-status', 'failed');
            return jsend({ statusCode: 201, message: 'Videos Updated failed!'});
        }
    },
     //4. delete Videos
    delete: async (req, res, next) => {
        const { videosId } = req.query;
        if (!videosId) return jsend(400, "Please send valid request data");
        try {
            const videos = await Videos.findOne({
               videosId
            });
            if (videos) {
                await vimeo.deleteVideo(videos.videosUrl);
                if(videos.thumbnailUrl) await S3.s3Delete([videos.thumbnailUrl]);
                await Videos.destroy({
                     videosId
                });
                return jsend({ statusCode: 200, message: 'Videos deleted successfully', });
            } else {
                return jsend({ statusCode: 404, message: 'Videos Not Found!', });
            }
        } catch (error) {
            return jsend({ statusCode: 201, message: 'Video deleted faied' });
        }
    },

};
