
const serviceLocator = require("../lib/service_locator");
const Login = serviceLocator.get("Login");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//1.Validate Login
    {
        path: "/api/login",
        method: "POST",
        handler: Login.validateLogin,
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
     // pre: [trimRequest, auth.verifyAccessToken]

    }
      },
      
//2.Validate Admin Login
    //   {
    //     path: "/api/login/adminfaculty",
    //     method: "POST",
    //     handler: Login.validateAdminLogin,
    //     options: {
    //   response: {
    //     status: {
    //       500() {
    //         throw ((createError.Unauthorized()))
    //       },
    //     },
    //     failAction(request, h, error) {
    //       return jsend(401, "Authorization failed.Please send valid token to proceed further")
    //     }
    //   },
    // //  pre: [trimRequest, auth.verifyAccessToken]

    // }
    //   },

]);
};

