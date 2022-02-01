const opts = {
    errorEventName: "trace",
    logDirectory: process.env.userErrorLog, // NOTE: folder must exist and be writable...
    fileNamePattern: "user-<DATE>.log",
    dateFormat: "YYYY.MM.DD",
    level: "trace",
};
var SimpleLogger = require("simple-node-logger"),
    manager = new SimpleLogger({ errorEventName: "error" });

manager.createConsoleAppender();
manager.createRollingFileAppender(opts);

module.exports = manager.createLogger("questioncloudbapi", "trace");
