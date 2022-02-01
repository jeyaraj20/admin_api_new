
const serviceLocator = require("../lib/service_locator");
const Imagefile = serviceLocator.get("Image");
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
//     storage: storage
// });
exports.routes = (server, serviceLocator) => {
    return server.route([
      
      //1. Update Imagefile
        {
            path: "/api/image",
            method: "POST",
            handler: Imagefile.create,
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

          //2. Delete Imagefile  
          {
            path: "/api/image",
            method: "DELETE",
            handler: Imagefile.delete,
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

          //3. Update Imagefile In Thumbnail
          {
            path: "/api/image/thumbnail",
            method: "POST",
            handler: Imagefile.create,
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


// ImageRoute.post("/", upload.single("notes"), ImageController.create);
// ImageRoute.delete("/", ImageController.delete);
// ImageRoute.post("/thumbnail", upload.single("thumbnail"), ImageController.create);
 

]);
};

