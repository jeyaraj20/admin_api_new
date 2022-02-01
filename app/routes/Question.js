const serviceLocator = require("../lib/service_locator");
const Question = serviceLocator.get("Question");
const auth = serviceLocator.get('jwtHelper');
const fs = serviceLocator.get("fs");
const path = serviceLocator.get("path");
const multer = serviceLocator.get("multer");
const trimRequest = serviceLocator.get('trimRequest');
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([

//-------------------------- Multer Part Start ----------------------------------//

// Ensure Questions Directory directory exists
// var homeCategoryDir = path.join(process.env.questions);
// fs.existsSync(homeCategoryDir) || fs.mkdirSync(homeCategoryDir);

// const storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         callBack(null, process.env.questions);
//     },
//     filename: (req, file, callBack) => {
//         callBack(null, `file-${Date.now()}${path.extname(file.originalname)}`);
//     },
// });

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// };

// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: { fileSize: 10000000, files: 1 },
// });

//-------------------------- Multer Part End ---------------------------------------//

//-------------------------- Question Route Start ------------------------------//

//  1. Get All Question
{
    path: "/api/question/get/status",
    method: "POST",
    handler: Question.getAllQuestion,
       options: {
      response: {
        status: {
          500() {
            throw ((createError.Unauthorized()))
          },
        },
        failAction(request, h, error) {
          return jsend(401, "Authorization failed.Please send valid token to proceed further")
        }
      },
      pre: [trimRequest, auth.verifyAccessToken]

    }
  },

// 2. Get Question By Sub Category Id
{
  path: "/api/question/subId/{sub_id}",
  method: "GET",
  handler: Question.getQuestionByCategories,
    options: {
      response: {
        status: {
          500() {
            throw ((createError.Unauthorized()))
          },
        },
        failAction(request, h, error) {
          return jsend(401, "Authorization failed.Please send valid token to proceed further")
        }
      },
      pre: [trimRequest, auth.verifyAccessToken]

    }
},

//  3. Get Question By Id
{
  path: "/api/question/qId/{qId}",
  method: "GET",
  handler: Question.getQuestionById,
     options: {
      response: {
        status: {
          500() {
            throw ((createError.Unauthorized()))
          },
        },
        failAction(request, h, error) {
          return jsend(401, "Authorization failed.Please send valid token to proceed further")
        }
      },
      pre: [trimRequest, auth.verifyAccessToken]

    }
},

//  4. Create Question
{
  path: "/api/question",
  method: "POST",
  handler: Question.createQuestion,
     options: {
      response: {
        status: {
          500() {
            throw ((createError.Unauthorized()))
          },
        },
        failAction(request, h, error) {
          return jsend(401, "Authorization failed.Please send valid token to proceed further")
        }
      },
      pre: [trimRequest, auth.verifyAccessToken]

    }
},

// 5. Update Question
{
  path: "/api/question/qid/{qId}",
  method: "PUT",
  handler: Question.updateQuestionById,
    options: {
      response: {
        status: {
          500() {
            throw ((createError.Unauthorized()))
          },
        },
        failAction(request, h, error) {
          return jsend(401, "Authorization failed.Please send valid token to proceed further")
        }
      },
      pre: [trimRequest, auth.verifyAccessToken]

    }
},

// 6. Question Count
{
  path: "/api/question/questionNo",
  method: "POST",
  handler: Question.getQuestionNo,
     options: {
      response: {
        status: {
          500() {
            throw ((createError.Unauthorized()))
          },
        },
        failAction(request, h, error) {
          return jsend(401, "Authorization failed.Please send valid token to proceed further")
        }
      },
      pre: [trimRequest, auth.verifyAccessToken]

    }
},

// 7. Update 'Active / Inactive / Delete'
{
  path: "/api/question/inactive",
  method: "PUT",
  handler: Question.updateStatusById,
     options: {
      response: {
        status: {
          500() {
            throw ((createError.Unauthorized()))
          },
        },
        failAction(request, h, error) {
          return jsend(401, "Authorization failed.Please send valid token to proceed further")
        }
      },
      pre: [trimRequest, auth.verifyAccessToken]

    }
},

// 8. Get Dashboard Count
{
  path: "/api/question/dashboard/count",
  method: "GET",
  handler: Question.getQuestionsCount,
   options: {
      response: {
        status: {
          500() {
            throw ((createError.Unauthorized()))
          },
        },
        failAction(request, h, error) {
          return jsend(401, "Authorization failed.Please send valid token to proceed further")
        }
      },
      pre: [trimRequest, auth.verifyAccessToken]

    }
},

//9. GetAllocateQuestion
{
  path: "/api/question/view",
  method: "POST",
  handler: Question.getAllocateQuestion,
    options: {
      response: {
        status: {
          500() {
            throw ((createError.Unauthorized()))
          },
        },
        failAction(request, h, error) {
          return jsend(401, "Authorization failed.Please send valid token to proceed further")
        }
      },
      pre: [trimRequest, auth.verifyAccessToken]

    }
},

//10.GetAllocateQuestionTotalCount
{
  path: "/api/question/totalcount",
  method: "POST",
  handler: Question.getAllocateQuestionTotalCount,
   options: {
      response: {
        status: {
          500() {
            throw ((createError.Unauthorized()))
          },
        },
        failAction(request, h, error) {
          return jsend(401, "Authorization failed.Please send valid token to proceed further")
        }
      },
      pre: [trimRequest, auth.verifyAccessToken]

    }
},

// 11. Question Search Result
{
  path: "/api/question/search-criteria/",
  method: "POST",
  handler: Question.getSearchResult,
     options: {
      response: {
        status: {
          500() {
            throw ((createError.Unauthorized()))
          },
        },
        failAction(request, h, error) {
          return jsend(401, "Authorization failed.Please send valid token to proceed further")
        }
      },
      pre: [trimRequest, auth.verifyAccessToken]

    }
},

// 12. Get Questions Count Only
{
  path: "/api/question/active-inactive/count/",
  method: "POST",
  handler: Question.getQuestionsCountOnly,
     options: {
      response: {
        status: {
          500() {
            throw ((createError.Unauthorized()))
          },
        },
        failAction(request, h, error) {
          return jsend(401, "Authorization failed.Please send valid token to proceed further")
        }
      },
      pre: [trimRequest, auth.verifyAccessToken]

    }
},

//13.GetCategoryName
{
  path: "/api/question/getcategory",
  method: "POST",
  handler: Question.getCategoryName,
    options: {
      response: {
        status: {
          500() {
            throw ((createError.Unauthorized()))
          },
        },
        failAction(request, h, error) {
          return jsend(401, "Authorization failed.Please send valid token to proceed further")
        }
      },
      pre: [trimRequest, auth.verifyAccessToken]

    }
},

// 14. Create Passage Question
{
  path: "/api/question/passage",
  method: "POST",
  handler: Question.createPassageQuestions,
     options: {
      response: {
        status: {
          500() {
            throw ((createError.Unauthorized()))
          },
        },
        failAction(request, h, error) {
          return jsend(401, "Authorization failed.Please send valid token to proceed further")
        }
      },
      pre: [trimRequest, auth.verifyAccessToken]

    }
},

// 15. Get Passage Question
{
  path: "/api/question/passage/qid/{qid}",
  method: "GET",
  handler: Question.getPassageQuestionById,
     options: {
      response: {
        status: {
          500() {
            throw ((createError.Unauthorized()))
          },
        },
        failAction(request, h, error) {
          return jsend(401, "Authorization failed.Please send valid token to proceed further")
        }
      },
      pre: [trimRequest, auth.verifyAccessToken]

    }
},

// 16. Update Passage Question
{
  path: "/api/question/passage/{qid}",
  method: "PUT",
  handler: Question.updatePassageQuestions,
     options: {
      response: {
        status: {
          500() {
            throw ((createError.Unauthorized()))
          },
        },
        failAction(request, h, error) {
          return jsend(401, "Authorization failed.Please send valid token to proceed further")
        }
      },
      pre: [trimRequest, auth.verifyAccessToken]

    }
},
// 17. Delete Passage Question
{
  path: "/api/question/passage/delete/qid/{qid}",
  method: "GET",
  handler: Question.deletePassageQuestions,
     options: {
      response: {
        status: {
          500() {
            throw ((createError.Unauthorized()))
          },
        },
        failAction(request, h, error) {
          return jsend(401, "Authorization failed.Please send valid token to proceed further")
        }
      },
      pre: [trimRequest, auth.verifyAccessToken]

    }
},
//-------------------------- Question Route End -----------------------------------//

]);
};
