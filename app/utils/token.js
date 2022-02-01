"use strict";

const serviceLocator = require("../lib/service_locator");
const jsonwebtoken = serviceLocator.get("jsonwebtoken");
const mongoose = serviceLocator.get("mongoose");
const Sessions = mongoose.model("Sessions");
const config = require("../configs/configs")();

class Jwt {
  constructor() {}

  async createToken(entity, modelName) {
    const GUID = new Date().getTime();
    const session = new Sessions({
      mobileNumber: entity.mobileNumber,
      id: entity._id,
      auth: GUID,
      valid: true,
      type: modelName,
    });

    await session.save();

    return jsonwebtoken.sign(
      { mobileNumber: entity.mobileNumber, id: entity._id, auth: GUID },
      config.jwt.secretKey,
      {
        algorithm: config.jwt.algorithms,
        expiresIn: Number(config.jwt.expiration),
      }
    );
  }
  async destroyToken(modelName, token, auth) {
    var decoded = false;
    try {
      decoded = jsonwebtoken.verify(token.split(" ")[1], config.jwt.secretKey);
    } catch (e) {
      decoded = false;
    }

    if (decoded) {
      let updated;
      const session = await Sessions.findOne({
        auth: auth,
        type: modelName,
      });

      updated = session;
      updated.valid = false;

      return await Sessions.updateOne(
        {
          auth,
        },
        updated
      ).then((result) => {
        return updated.valid;
      });
    } else {
      return true;
    }
  }
  async verifyToken(token, auth) {
    var decoded = false;
    try {
      decoded = jsonwebtoken.verify(token.split(" ")[1], config.jwt.secretKey);
    } catch (e) {
      decoded = false;
    }

    if (!decoded || !decoded.auth) {
      return false;
    } else {
      return await Sessions.findOne({
        auth: auth,
        valid: true,
      }).then(async (session) => {
        if (session) {
          return session.valid || false;
        } else {
          return false;
        }
      });
    }
  }
}

module.exports = Jwt;
