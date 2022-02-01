const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const serviceLocator = require("../lib/service_locator");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

module.exports = {
    //  1. Sign Access Token (Create Token)
    signAccessToken: (payloadData) => {
        return new Promise((resolve, reject) => {
            const payload = payloadData;
            const secret = ACCESS_SECRET;
            const options = {
                expiresIn: "1h",
                issuer: "cloudb.com",
                audience: payloadData.user.email,
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    logger.error(err.message);
                    reject(createError.InternalServerError());
                }
                resolve(token);
            });
        });
    },


    // 2. Verify Access Token, Valid or Not
    verifyAccessToken: (req, callback) => {
        if (!req.headers["x-auth-token"]) {
            throw ((createError.Unauthorized()))
        }
        const token = req.headers["x-auth-token"];
        JWT.verify(token, ACCESS_SECRET, (err, payload) => {
            if (err) {
                logger.error(err)
                const message = err.name === "JsonwebTokenError" ? "Unauthorized" : err.message;
                throw (createError.Unauthorized(message));
            }
            if (typeof req.payload == 'string') {
                req.payload = { ...payload, ...JSON.parse(req.payload) }

            } else {
                req.payload = { ...req.payload, ...payload }
            }

            return (req.payload)
        });

        return {}
    },

    //  3. Sign Refresh Token (Create Token)
    signRefreshToken: async (payloadData) => {
        return new Promise((resolve, reject) => {
            const payload = payloadData;
            const secret = REFRESH_SECRET;
            const options = {
                expiresIn: "1y",
                issuer: "cloudb.com",
                audience: payloadData.user.email,
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    logger.error(err.message);
                    reject(createError.InternalServerError());
                }
                resolve(token);
            });
        });
    },

    // 4. Verify Refresh Token, Valid or Not
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, REFRESH_SECRET, (err, payload) => {
                if (err) reject(createError.Unauthorized());
                const payloadData = {
                    user: {
                        id: payload.user.id,
                        name: payload.user.name,
                        email: payload.user.email,
                        regno: payload.user.regno,
                        type: payload.user.type,
                        status: payload.user.status,
                        mobile: payload.user.mobile,
                        schoolId: payload.user.schoolId,
                        mastercatid: payload.user.mastercatid,
                    },
                };
                resolve(payloadData);
            });
        });
    },
};
