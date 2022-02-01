
const serviceLocator = require("../lib/service_locator");
const ExamPackage = serviceLocator.get("ExamPackage");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- Exam Package Route Start ------------------------------//

// 1. Get All Exam Package
{
    path: "/api/exampackage/status/{status}",
    method: "GET",
    handler: ExamPackage.getAllExamPackage,
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

  // 2.Create Exam Package
  {
    path: "/api/exampackage",
    method: "POST",
    handler: ExamPackage.createExamPackage,
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

  //3.Create New Exam Package
   {
    path: "/api/exampackage/new",
    method: "POST",
    handler: ExamPackage.createNewExamPackage,
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

  //4.Update Exam Package
  {
    path: "/api/exampackage/id/{package_id}",
    method: "PUT",
    handler: ExamPackage.updateExamPackage,
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

  //5.Update Status By Id
  {
    path: "/api/exampackage/status",
    method: "PUT",
    handler: ExamPackage.updateStatusById,
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

  //6.Get All Durations
  {
    path: "/api/exampackage/duration",
    method: "GET",
    handler: ExamPackage.getAllDurations,
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

  //7.Get Exam Durations
  {
    path: "/api/exampackage/examduration/{package_id}",
    method: "GET",
    handler: ExamPackage.getExamDurations,
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
  
//-------------------------- Exam Package Route End -----------------------------------//

]);
};

