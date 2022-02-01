"use strict";

const serviceLocator = require("./service_locator");
const config = require("../configs/configs")();
const log = serviceLocator.get("logger");
const http = require("https");
const fetch = serviceLocator.get("fetch");
const bluebird = serviceLocator.get("bluebird");
fetch.Promise = bluebird;

class smsService {
  constructor() {}

  async sendReq(options) {
    return await fetch(`${options.uri}`)
      .then((res) => {
        log.info(`Getting resposne from msg91`);
        return res.json();
      })
      .catch((err) => {
        log.error(`Getting error from msg91`);
        log.error(err.stack);
        return err.stack;
      });
  }

  async sendReqPost(options) {
    return await fetch(`${options.uri}`)
      .then((res) => {
        log.info(`Getting resposne from msg91`);
        return res.json();
      })
      .catch((err) => {
        log.error(`Getting error from msg91`);
        log.error(err.stack);
        return err.stack;
      });
  }

  async sendReqPost(options) {
    const sendSMS = await fetch(
      `https://api.msg91.com/api/v5/flow/`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "authkey" : config.sms.authkey
        },
        body : JSON.stringify(options)
      }
    ).then( async res => {
      let rk = await res.json();
      return rk;
    }).catch(error =>{
      return error;
    })
    return sendSMS;
  };

  async sendOTP(mobileNumber, otp) {
    log.info(
      `Entering into sendotp function : mobileNumber is ${mobileNumber} otp ${otp}`
    );
    const message = `${config.sms.message}`.replace("{{otp}}", otp);
    var options = {
      uri: `${config.sms.hostname}/api/sendotp.php?authkey=${config.sms.authkey}&mobiles=${mobileNumber}&message=${message}&sender=NAMMAC&DLT_TE_ID=1307161760707692117&otp=${otp}&otp_expiry=${config.sms.setOtpExpiry}`,
    };
    const result = await this.sendReq(options);
    return result;
  }

  async verifyOTP(mobileNumber, otp) {
    var options = {
      uri: `${config.sms.hostname}/api/verifyRequestOTP.php?authkey=${config.sms.authkey}&mobile=${mobileNumber}&otp=${otp}`,
    };
    const result = await this.sendReq(options);
    return result;
  }

  async resendOTP(mobileNumber) {
    var options = {
      uri: `${config.sms.hostname}/api/retryotp.php?authkey=${config.sms.authkey}&retrytype=text&mobile=${mobileNumber}`,
    };
    const result = await this.sendReq(options);
    return result;
  }

  async sendSellerApprovedSMS(mobileNumber) {
    var options = {
      "flow_id": config.sms.DLT_TE_ID_Approved,
      "sender": "NAMMAC",
      "mobiles": `91${mobileNumber}`
    };
    const result = await this.sendReqPost(options);
    return result;
  }

  async sendSellerRejectionSMS(mobileNumber, reason) {
    var options = {
      "flow_id": config.sms.DLT_TE_ID_Rejection,
      "sender": "NAMMAC",
      "mobiles": `91${mobileNumber}`,
      "Reject Reason" : reason
    };
    const result = await this.sendReqPost(options);
    return result;
  }

}

module.exports = smsService;
