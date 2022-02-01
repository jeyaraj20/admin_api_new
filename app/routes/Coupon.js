
const serviceLocator = require("../lib/service_locator");
const Coupon = serviceLocator.get("Coupon");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- Exam Package Route Start ------------------------------//

 // 1. Get All Coupons
  {
    path: "/api/coupon/status/{status}",
    method: "GET",
    handler: Coupon.getAllCoupons,
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

  //2.Create Coupon
  {
    path: "/api/coupon",
    method: "POST",
    handler: Coupon.createCoupon,
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

  //3.Update Coupon
  {
    path: "/api/coupon/id/{coupon_id}",
    method: "PUT",
    handler: Coupon.updateCoupon,
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

  //4.Update Status By Id
  {
    path: "/api/coupon/status",
    method: "PUT",
    handler: Coupon.updateStatusById,
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
  
  //5.Get All Durations
  {
    path: "/api/coupon/duration",
    method: "GET",
    handler: Coupon.getAllDurations,
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

//-------------------------- Exam Package Route End -----------------------------------//

