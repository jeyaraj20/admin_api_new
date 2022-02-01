
const serviceLocator = require("../lib/service_locator");
const Category = serviceLocator.get("Category");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const createError = require("http-errors");
const jsend = serviceLocator.get("jsend");


exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- Category Route Start ------------------------------//

// 1. Get All Active Category
{
    path: "/api/category/",
    method: "GET",
    handler: Category.getAllActiveCategory,
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

  //2. Get All Category By Asc
  {
    path: "/api/category/asc",
    method: "GET",
    handler: Category.getAllCategoryByAsc,
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

  //3. Get All Inactive Category
  {
    path: "/api/category/inactive/",
    method: "GET",
    handler: Category.getAllInactiveCategory,
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

  //4.Get Category By Id
  {
    path: "/api/category/{catId}",
    method: "GET",
    handler: Category.getCategoryById,
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

  //5.Get Category By Position
  {
    path: "/api/category/position/{position}",
    method: "GET",
    handler: Category.getCategoryByPosition,
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

  //6.CreateCategory
  {
    path: "/api/category",
    method: "POST",
    handler: Category.createCategory,
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

  //7.Update Category By Id
  {
    path: "/api/category/catId/{catId}",
    method: "PUT",
    handler: Category.updateCategoryById,
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

  //8.Update Inactive By Id
  {
    path: "/api/category/inactive",
    method: "PUT",
    handler: Category.updateInactiveById,
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

  // 9. Update Delete By Id
  {
    path: "/api/category",
    method: "DELETE",
    handler: Category.updateDeleteById,
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

  //10.Update Position By Id
  {
    path: "/api/category/position",
    method: "PUT",
    handler: Category.updatePositionById,
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

  //11.Get Category By Name
  {
    path: "/api/category/catname/{cat_name}",
    method: "GET",
    handler: Category.getCategoryByName,
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
  
  //12.Get Category Count
  {
    path: "/api/category/qbank-main/count/{cat_status}",
    method: "GET",
    handler: Category.getCategoryCount,
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

// //-------------------------- Category Route End -----------------------------------//

]);
};
