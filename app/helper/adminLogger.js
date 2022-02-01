require('dotenv').config();

const opts = {
    errorEventName: "trace",
    logDirectory: process.env.adminErrorLog, // NOTE: folder must exist and be writable...
    fileNamePattern: "admin-<DATE>.log",
    dateFormat: "YYYY.MM.DD",
    level: "trace",
};
var SimpleLogger = require("simple-node-logger"),
    manager = new SimpleLogger({ errorEventName: "error" });

manager.createConsoleAppender();
manager.createRollingFileAppender(opts);

module.exports = manager.createLogger("questioncloudbapi", "trace");
