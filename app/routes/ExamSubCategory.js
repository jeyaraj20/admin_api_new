
const serviceLocator = require("../lib/service_locator");
const ExamSubCategory = serviceLocator.get("ExamSubCategory");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- Exam Main Category Route Start ------------------------------//

// 1. Get All Exam Sub Category
  {
    path: "/api/examsubcategory/status/{status}",
    method: "GET",
    handler: ExamSubCategory.getAllExamSubCategory,
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

  //2.Get All Exam SubCategory Chapter
  {
    path: "/api/examsubcategory/chapter/{exa_cat_id}",
    method: "GET",
    handler: ExamSubCategory.getAllExamSubCategoryChapter,
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

  //3.Get All Exam SubCategory Types
  {
    path: "/api/examsubcategory/type/{exa_cat_id}",
    method: "GET",
    handler: ExamSubCategory.getAllExamSubCategoryTypes,
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

// 4. Create Exam Sub Category
{
  path: "/api/examsubcategory",
  method: "POST",
  handler: ExamSubCategory.createExamSubCategory,
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

// 5. Get Exam Sub Category
{
  path: "/api/examsubcategory/id/{exa_cat_id}",
  method: "GET",
  handler: ExamSubCategory.getExamSubCategoryById,
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

//  6. Update Exam Sub Category
{
  path: "/api/examsubcategory/id/{exa_cat_id}",
  method: "PUT",
  handler: ExamSubCategory.updateExamSubCategory,
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
  path: "/api/examsubcategory/status",
  method: "PUT",
  handler: ExamSubCategory.updateStatusById,
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

// 8. Exam Sub Category Search Result
{
  path: "/api/examsubcategory/search-criteria/",
  method: "POST",
  handler: ExamSubCategory.getSearchResult,
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

// 9. Get Exam Sub Category Count Only
{
  path: "/api/examsubcategory/sub-cat/count/{exa_cat_status}",
  method: "GET",
  handler: ExamSubCategory.getExamSubCount,
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

// 10. Exam Sub Category Questions Assign Search Criteria
{
  path: "/api/examsubcategory/question/assign/search-criteria",
  method: "POST",
  handler: ExamSubCategory.questionAssignSearch,
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


