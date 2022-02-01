
const serviceLocator = require("../lib/service_locator");
const ExamQuestion = serviceLocator.get("Examquestion");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- ExamQuestion Route Start -----------------------------------//

 // 1. Create ExamQuestion (Assign)
{
    path: "/api/examquestion",
    method: "POST",
    handler: ExamQuestion.createExamQuestion,
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

 // 2.Create Bank Exam Question
{
  path: "/api/examquestion/bank",
  method: "POST",
  handler: ExamQuestion.createBankExamQuestion,
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

//3.Get Assigned Exam Questions
{
  path: "/api/examquestion/getassinged",
  method: "POST",
  handler: ExamQuestion.getAssignedExamQuestions,
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

//4.Get Assigned Exam Questions Count
{
  path: "/api/examquestion/getassingedcount",
  method: "POST",
  handler: ExamQuestion.getAssignedExamQuestionsCount,
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

//5.Remove Assigned Question
{
  path: "/api/examquestion",
  method: "PUT",
  handler: ExamQuestion.removeAssignedQuestion,
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

//-------------------------- ExamQuestion Route End -----------------------------------//

]);
};


