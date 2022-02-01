
const serviceLocator = require("../lib/service_locator");
const Settings = serviceLocator.get("Settings");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- Settings Route Start -----------------------------------//

// // 1. Get Settings
{
    path: "/api/settings",
    method: "GET",
    handler: Settings.getSettings,
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
// SettingsRoute.get("/",auth, SettingsController.getSettings);

// // 3. Update Settings
{
    path: "/api/settings",
    method: "PUT",
    handler: Settings.updateSettings,
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

//-------------------------- Settings Route End -----------------------------------//

]);
};

