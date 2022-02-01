
const serviceLocator = require("../lib/service_locator");
const Notes = serviceLocator.get("Notes");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
exports.routes = (server, serviceLocator) => {
  return server.route([
    //1.Get Chapters
      {
        path: "/api/notes/getChapters",
        method: "POST",
        handler: Notes.getChapters,
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

      //2.Get Notes By ChapterId
      {
        path: "/api/notes/{chapterId}",
        method: "GET",
        handler: Notes.get,
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

      //3.Notes Create
      {
        path: "/api/notes",
        method: "POST",
        handler: Notes.create,
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

      //4.Update By Id
      {
        path: "/api/notes/{notesId}",
        method: "PUT",
        handler: Notes.update,
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

      // 5.delete Notes
      {
        path: "/api/notes",
        method: "DELETE",
        handler: Notes.delete,
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

      //6.GetFiles By Id
      {
        path: "/api/notes/file/{notesId}",
        method: "GET",
        handler: Notes.getFiles,
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
