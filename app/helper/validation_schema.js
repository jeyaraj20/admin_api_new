const Joi = require("@hapi/joi");

const schoolSchema = Joi.object({
    schoolName: Joi.string().required(),
    address1: Joi.string().max(140).required(),
    phoneNumber: Joi.number().max(10).required(),
    emailId: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    contactPerson: Joi.string().max(50),
    mobileNumber: Joi.number().max(10),
    totalStudents: Joi.number().integer().min(0).required(),
    schoolStatus: Joi.string().valid("Y", "N", "D"),
    ipAddress: Joi.string().ip(),
});

module.exports = {
    schoolSchema,
};
