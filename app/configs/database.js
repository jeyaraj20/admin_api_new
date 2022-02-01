"use strict";

const serviceLocator = require("../lib/service_locator");
const logger = serviceLocator.get("logger");
const path = serviceLocator.get("path");
const fs = serviceLocator.get("fs");

class Database {
  constructor(port, host, dbname, username, password) {
    this.mongoose = serviceLocator.get("mongoose");
    this._connect(port, host, dbname, username, password);
  }

  _connect(port, host, dbname, username, password) {
    this.mongoose.Promise = global.Promise;
    // if (username && password) {
    //   this.mongoose.connect(
    //     `mongodb://${username}:${password}@${host}:${port}/${dbname}?authSource=admin`
    //   );
    // } else {
      this.mongoose.connect(
        `mongodb://${host}:${port}/${dbname}`
      );
    // }

    const { connection } = this.mongoose;
    connection.on("connected", () =>
      logger.info("Database Connection was Successful")
    );
    connection.on("error", (err) =>
      logger.info("Database Connection Failed" + err)
    );
    connection.on("disconnected", () =>
      logger.info("Database Connection Disconnected")
    );
    process.on("SIGINT", () => {
      connection.close();
      logger.info(
        "Database Connection closed due to NodeJs process termination"
      );
      process.exit(0);
    });

    // initialize Model
    fs.readdirSync("app/models").forEach((file) => {
      require(path.join(__dirname, "..", "models", file));
    });
  }
}

module.exports = Database;
