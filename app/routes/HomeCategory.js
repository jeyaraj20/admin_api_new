
const serviceLocator = require("../lib/service_locator");
const HomeCategory = serviceLocator.get("Homecategory");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const fs = serviceLocator.get("fs");
const path = serviceLocator.get("path");
const multer = serviceLocator.get("multer");
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([

//-------------------------- Multer Part Start ----------------------------------//

// // Ensure HomeCategory Directory directory exists
// var homeCategoryDir = path.join(process.env.homeCategory);
// fs.existsSync(homeCategoryDir) || fs.mkdirSync(homeCategoryDir);

// const storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         callBack(null, process.env.homeCategory);
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

//-------------------------- Home Category Route Start ------------------------------//

 // 1. Get All Active Home Category
  {
    path: "/api/homecategory",
    method: "GET",
    handler: HomeCategory.getAllActiveHomeCategory,
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

// 2. Get All InActive Home Category
{
  path: "/api/homecategory/inactive",
  method: "GET",
  handler: HomeCategory.getAllInactiveHomeCategory,
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

// 3. Get Home Category By Position No
{
  path: "/api/homecategory/position/{position}",
  method: "GET",
  handler: HomeCategory.getHomeCategoryByPosition,
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

 // 4. Create Home Category
{
  path: "/api/homecategory",
  method: "POST",
  handler: HomeCategory.createHomeCategory,
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

 // 5. Update Home Category
{
  path: "/api/homecategory/catId/{catId}",
  method: "PUT",
  handler: HomeCategory.updateHomeCategoryById,
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

//  6. Update 'Inactive'
{
  path: "/api/homecategory/inactive",
  method: "PUT",
  handler: HomeCategory.updateInactiveById,
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

// 7. Update 'Delete'
{
  path: "/api/homecategory",
  method: "DELETE",
  handler: HomeCategory.updateDeleteById,
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

//  8. Update 'Position'
{
  path: "/api/homecategory/position",
  method: "PUT",
  handler: HomeCategory.updatePositionById,
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

//9. Get Home Category By Id
{
  path: "/api/homecategory/{catId}",
  method: "GET",
  handler: HomeCategory.getHomeCategoryById,
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

// 10. Get Home Category By name
{
  path: "/api/homecategory/categoryName/{catName}",
  method: "GET",
  handler: HomeCategory.getHomeCategoryBycategoryName,
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

//  11. Search Home Category
{
  path: "/api/homecategory/search",
  method: "POST",
  handler: HomeCategory.getSearchResult,
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

// 12. Get Count Only
{
  path: "/api/homecategory/count/status/{status}",
  method: "GET",
  handler: HomeCategory.getCountOnly,
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

//-------------------------- Home Category Route End -----------------------------------//


]);
};


