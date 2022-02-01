const serviceLocator = require("../lib/service_locator");
const Exam = serviceLocator.get("Exam");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const createError = require("http-errors");
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- Exam Route Start -----------------------------------//

  // 1. Get All Exam 
{
    path: "/api/exam",
    method: "POST",
    handler: Exam.getAllExam,
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

  //2.Get All Exam Count
  {
    path: "/api/exam/examcount",
    method: "POST",
    handler: Exam.getAllExamCount,
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

  //3.Get All Exam With Assignedcount
  {
    path: "/api/exam/assignedcount",
    method: "POST",
    handler: Exam.getAllExamWithAssignedcount,
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

  // 4. Get Exam By Id
{
    path: "/api/exam/id/{id}",
    method: "GET",
    handler: Exam.getExamById,
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

  // 5. Create Common Exam
 {
    path: "/api/exam/create",
    method: "POST",
    handler: Exam.createExam,
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

  // 6. Create Bank Exam
 {
    path: "/api/exam/bexam",
    method: "POST",
    handler: Exam.createBankExam,
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

 // 7. Create Sectional Exam
{
    path: "/api/exam/sexam",
    method: "POST",
    handler: Exam.createSectionalExam,
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
 // 8. Update Exam By Id
 {
    path: "/api/exam/id/{id}",
    method: "PUT",
    handler: Exam.updateExamById,
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

 // 9. Update Bank Exam By Id
{
    path: "/api/exam/bexam/id/{id}",
    method: "PUT",
    handler: Exam.updateBankExamById,
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

  // 10. Update Section Exam By Id
  {
    path: "/api/exam/sexam/id/{id}",
    method: "PUT",
    handler: Exam.updateSectionalExamById,
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

 // 11. Update Exam Status 'Inactive / Active / Delete'
{
    path: "/api/exam/status",
    method: "PUT",
    handler: Exam.updateStatusById,
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

 //12.Get Previous Year
{
    path: "/api/exam/previousyear",
    method: "POST",
    handler: Exam.getPreviousYear,
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

 //13.Get Test Types
  {
    path: "/api/exam/getTestTypes/{sub_cat_id}",
    method: "GET",
    handler: Exam.getTestTypes,
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

  //14.Get Chapters
  {
    path: "/api/exam/getChapters/{sub_cat_id}",
    method: "GET",
    handler: Exam.getChapters,
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

  //15.Get Test TypesEdit
  {
    path: "/api/exam/getTestTypesEdit/{sub_cat_id}",
    method: "GET",
    handler: Exam.getTestTypesEdit,
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

  //16.Get Chapters Edit
  {
    path: "/api/exam/getChaptersEdit/{sub_cat_id}",
    method: "GET",
    handler: Exam.getChaptersEdit,
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
  
  //17.Get Section
  {
    path: "/api/exam/getSection/{exam_id}",
    method: "GET",
    handler: Exam.getSection,
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

  //18.Get Search Result
  {
    path: "/api/exam/search-criteria/",
    method: "POST",
    handler: Exam.getSearchResult,
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

  //19.Get All Exam Count
  {
    path: "/api/exam/all-exam/count",
    method: "POST",
    handler: Exam.getAllExamCount,
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

  //20.Move Exam
  {
    path: "/api/exam/moveexam/",
    method: "POST",
    handler: Exam.moveExam,
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

  //21.Get All Attend Exam
  {
    path: "/api/exam/allattendexam",
    method: "GET",
    handler: Exam.getAllAttendExam,
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

  //22.Get All PaidExam
  {
    path: "/api/exam/allpaidexam",
    method: "GET",
    handler: Exam.getAllPaidExam,
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

  //23.Get Automatic Rows
  {
    path: "/api/exam/getautomaticrows/{exam_id}",
    method: "GET",
    handler: Exam.getAutomaticRows,
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

  
//-------------------------- Exam Route End -----------------------------------//

]);
};

