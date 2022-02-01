
const serviceLocator = require("../lib/service_locator");
const SubCategory = serviceLocator.get("SubCategory");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- SubCategory Route Start ------------------------------//

//  1. Get All Active SubCategory
  {
    path: "/api/subcategory/status/{status}",
    method: "GET",
    handler: SubCategory.getAllActiveSubCategory,
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

//2.Get AllActive SubCategory Alone
  {
    path: "/api/subcategory/subcat/status/{status}",
    method: "GET",
    handler: SubCategory.getAllActiveSubCategoryAlone,
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

// 3. Get All Inactive SubCategory
{
  path: "/api/subcategory/inactive",
  method: "GET",
  handler: SubCategory.getAllInActiveSubCategory,
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

// 4. Create SubCategory By Id
{
  path: "/api/subcategory",
  method: "POST",
  handler: SubCategory.createSubCategoryById,
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

// 5. Get Sub Category By Id
{
  path: "/api/subcategory/{catId}",
  method: "GET",
  handler: SubCategory.getSubCategoryById,
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

// 6. Update Sub Category
{
  path: "/api/subcategory/pid/{pid}",
  method: "PUT",
  handler: SubCategory.updateSubCategoryById,
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

// 7. Update 'Inactive'
{
  path: "/api/subcategory/inactive",
  method: "PUT",
  handler: SubCategory.updateInactiveById,
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

// 8. Update 'Delete'
{
  path: "/api/subcategory",
  method: "DELETE",
  handler: SubCategory.updateDeleteById,
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

// 9. Exam Sub Category Search Result
{
  path: "/api/subcategory/search-criteria/",
  method: "POST",
  handler: SubCategory.getSearchResult,
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

//10. Get QBank Sub Category Count Only
{
  path: "/api/subcategory/qbank-sub/count/{cat_status}",
  method: "GET",
  handler: SubCategory.getSubCategoryCount,
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
// 11. Get Sub Category By Category Id
{
  path: "/api/subcategory/sub/{catId}",
  method: "GET",
  handler: SubCategory.getSubCategoryByCatId,
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

//12. Get Questionspdf
{
  path: "/api/subcategory/get/Questionspdf",
  method: "POST",
  handler: SubCategory.getQuestionspdf,
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

//13.Get Question PDF report
{
  path: "/api/subcategory/get/Questionspdfreport",
  method: "POST",
  handler: SubCategory.getQuestionPDFreport,
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

//14.Get Exam Questions pdf
{
  path: "/api/subcategory/get/ExamQuestionpdf",
  method: "POST",
  handler: SubCategory.getExamQuestionspdf,
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

//15.Update Position By Id
{
  path: "/api/subcategory/position",
  method: "PUT",
  handler: SubCategory.updatePositionById,
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

//16.Get All Admin
{
  path: "/api/subcategory/get/alladmin",
  method: "POST",
  handler: SubCategory.getAllAdmin,
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

//17.Get All Admin Questions
{
  path: "/api/subcategory/get/alladminquestions",
  method: "POST",
  handler: SubCategory.getAllAdminQuestions,
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

//-------------------------- SubCategory Route End -----------------------------------//


]);
};


