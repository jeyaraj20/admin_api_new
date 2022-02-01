
const serviceLocator = require("../lib/service_locator");
const Videos = serviceLocator.get("Videos");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const path = serviceLocator.get("path");
const multer = serviceLocator.get("multer");
const jsend = serviceLocator.get("jsend");


// const storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         callBack(null, '/tmp');
//     },
//     filename: (req, file, callBack) => {
//         callBack(null, `file-${Date.now()}${path.extname(file.originalname)}`);
//     },
// });

// const upload = multer({
//     storage: storage,
// });

exports.routes = (server, serviceLocator) => {
    return server.route([
// 1.Get Videos
        {
            path: "/api/videos",
            method: "GET",
            handler: Videos.get,
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
//2. Upload Videos
          {
            path: "/api/videos",
            method: "POST",
            handler: Videos.create,
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
//3. Update Videos
          {
            path: "/api/videos/{videosId}",
            method: "PUT",
            handler: Videos.update,
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
//4.Delete Videos
          {
            path: "/api/videos/{videosId}",
            method: "DELETE",
            handler: Videos.delete,
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

]);
};


