
const serviceLocator = require("../lib/service_locator");
const Student = serviceLocator.get("Student");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- Student Route Start -----------------------------------//

//  1. Get All Active Student
{
    path: "/api/student/status/{stud_status}",
    method: "GET",
    handler: Student.getAllStudent,
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

//  2. Get Student By Id
{
  path: "/api/student/id/{stud_id}",
  method: "GET",
  handler: Student.getStudentById,
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

//  3. Create Student
{
  path: "/api/student",
  method: "POST",
  handler: Student.createStudent,
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

//  4. Update Student
{
  path: "/api/student/id/{stud_id}",
  method: "PUT",
  handler: Student.updateStudentById,
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

//  5. Update 'Inactive / Active / Delete'
{
  path: "/api/student/status",
  method: "PUT",
  handler: Student.updateStatusById,
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

//  6. Get Students Count Only
{
  path: "/api/student/stud-count/{stud_status}",
  method: "GET",
  handler: Student.getStudentsCount,
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

//-------------------------- Student Route End -----------------------------------//

]);
};


