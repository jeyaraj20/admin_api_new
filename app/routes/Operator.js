
const serviceLocator = require("../lib/service_locator");
const Operator = serviceLocator.get("Operator");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- Operator Route Start ------------------------------//

//  1. Get All Active Operator
{
    path: "/api/operator/status/{status}",
    method: "GET",
    handler: Operator.getAllActiveOperator,
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

//  2. Get All Inactive Operator
{
  path: "/api/operator/inactive",
  method: "GET",
  handler: Operator.getAllInactiveOperator,
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

//  3. Get Operator By Id
{
  path: "/api/operator/{opId}",
  method: "GET",
  handler: Operator.getOperatorById,
  
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

//  4. Create Operator
{
  path: "/api/operator",
  method: "POST",
  handler: Operator.createOperator,
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

//  5. Update Operator
{
  path: "/api/operator/opId/{opId}",
  method: "PUT",
  handler: Operator.updateOperatorById,
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

//  6. Update 'Inactive / Active / Delete'
{
  path: "/api/operator/inactive",
  method: "PUT",
  handler: Operator.updateInactiveById,
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

// 7. Get Operators Count Only
{
  path: "/api/operator/opt-count/{op_status}",
  method: "GET",
  handler: Operator.getOperatorsCount,
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

//8.Get All Operator
{
  path: "/api/operator/getoperator/{status}",
  method: "GET",
  handler: Operator.getAllOperator,
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

// //-------------------------- Operator Route End -----------------------------------//


]);
};