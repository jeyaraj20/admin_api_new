"use strict";

async function verify(request, h, error) {
  return h
    .response({
      statusCode: 400,
      error: "Bad Request",
      message:
        "Invalid request " + error.details[0].message.replace(/['"]+/g, ""),
    })
    .code(400)
    .takeover();
}
module.exports = { verify };
