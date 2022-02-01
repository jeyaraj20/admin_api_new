const serviceLocator = require("../lib/service_locator");
const ExamMainCategory = serviceLocator.get("ExamMainCategory");
const auth = serviceLocator.get('jwtHelper');
const fs = serviceLocator.get("fs");
const path = serviceLocator.get("path");
const multer = serviceLocator.get("multer");
const trimRequest = serviceLocator.get('trimRequest');
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
// require("dotenv").config();

//-------------------------- Multer Part Start --------------------------------------//

// Ensure ExamMainCategory Directory directory exists
// var examMainCategoryDir = path.join(process.env.examCategory);
// fs.existsSync(examMainCategoryDir) || fs.mkdirSync(examMainCategoryDir);

// const storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         callBack(null, process.env.examCategory);
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

//-------------------------- Multer Part End -------------------------------------------//

//-------------------------- Exam Main Category Route Start ------------------------------//

// 1. Get All Master Category
{
    path: "/api/exammaincategory/master",
    method: "GET",
    handler: ExamMainCategory.getAllMasterCategory,
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

  //  2. Get All Main Category
  {
    path: "/api/exammaincategory/main/{masterId}",
    method: "GET",
    handler: ExamMainCategory.getAllMainCategory,
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

   //3. Get All Sub Category
  {
    path: "/api/exammaincategory/sub/{catId}",
    method: "GET",
    handler: ExamMainCategory.getAllSubCategory,
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

  // 4. Get All Main Category By Status
  {
    path: "/api/exammaincategory/{status}",
    method: "GET",
    handler: ExamMainCategory.getAllExamMainCategory,
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

  // 5. Get All Inactive Exam Main Category
  {
    path: "/api/exammaincategory/inactive",
    method: "GET",
    handler: ExamMainCategory.getAllInactiveExamMainCategory,
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

  // 6. Get Home Category By Id
  {
    path: "/api/exammaincategory/catId/{catId}",
    method: "GET",
    handler: ExamMainCategory.getExamMainCategoryById,
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

 // 7. Get Home Category By Position No
 {
  path: "/api/exammaincategory/position/{position}",
  method: "GET",
  handler: ExamMainCategory.getExamMainCategoryByPosition,
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

// 8. Create Home Category
{
  path: "/api/exammaincategory",
  method: "POST",
  handler: ExamMainCategory.createExamMainCategory,
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

// 9. Update Home Category
{
  path: "/api/exammaincategory/catId/{catId}",
  method: "PUT",
  handler: ExamMainCategory.updateExamMainCategoryById,
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

// 10. Update 'Active / Inactive / Delete'
{
  path: "/api/exammaincategory/inactive",
  method: "PUT",
  handler: ExamMainCategory.updateInactiveById,
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

// 11. Update 'Position'
{
  path: "/api/exammaincategory/position",
  method: "PUT",
  handler: ExamMainCategory.updatePositionById,
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

 // 12. Get Exam Main Category Count Only
{
  path: "/api/exammaincategory/main-cat/count/{exa_cat_status}",
  method: "GET",
  handler: ExamMainCategory.getExamMainCount,
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

//13.Get Home Master Category
{
  path: "/api/exammaincategory/category/{exacatid}",
  method: "GET",
  handler: ExamMainCategory.getHomeMasterCategory,
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

//14.Get All Exam Chapters
{
  path: "/api/exammaincategory/chapter/{subId}",
  method: "GET",
  handler: ExamMainCategory.getAllExamChapters,
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


//-------------------------- Exam Main Category Route End -----------------------------------//


]);
};

