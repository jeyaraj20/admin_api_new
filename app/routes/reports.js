
const serviceLocator = require("../lib/service_locator");
const Report = serviceLocator.get("Report");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- Adminmenu Route Start ------------------------------//

// 1. Get Reports
{
    path: "/api/reports/report",
    method: "POST",
    handler: Report.getReports,
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

// 2.Get ReportsNew
  {
    path: "/api/reports/reportpdf",
    method: "POST",
    handler: Report.getReportsNew,
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

  //3.Get MainReports
  {
    path: "/api/reports/mainreport",
    method: "POST",
    handler: Report.getMainReports,
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
  
  //4.Get Main ReportsNew
  {
    path: "/api/reports/mainreportpdf",
    method: "POST",
    handler: Report.getMainReportsNew,
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

 //5. Get Test Reports
  {
    path: "/api/reports/testreport",
    method: "POST",
    handler: Report.getTestReports,
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

  //6.Get Test ReportsNew
  {
    path: "/api/reports/testreportpdf",
    method: "POST",
    handler: Report.getTestReportsNew,
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

  //7.Get Overall Masters
  {
    path: "/api/reports/overallmaster",
    method: "POST",
    handler: Report.getOverallMasters,
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
  
  //8.Get Overall Masters New
  {
    path: "/api/reports/overallmasterpdf",
    method: "POST",
    handler: Report.getOverallMastersNew,
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

//-------------------------- Adminmenu Route End -----------------------------------//


]);
};
