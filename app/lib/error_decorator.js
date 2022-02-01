("use strict");

const Boom = require("boom");

exports.register = register;

exports.register.attributes = {
  name: "reply-decorates",
  version: "1.0.0",
};

function register(server, options, next) {
  // create yours decorates
  server.decorate("reply", "notFound", notFound);
  server.decorate("reply", "badImplementation", badImpl);
  server.decorate("reply", "unauthorized", unauthorized);

  next();
}

function notFound(messsage) {
  return this.response(Boom.notFound(message));
}

function badImpl(messsage) {
  return this.response(Boom.badImplementation(message));
}

function unauthorized(messsage) {
  return this.response(Boom.unauthorized(message));
}
