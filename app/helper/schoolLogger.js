const opts = {
    errorEventName: "trace",
    logDirectory: process.env.schoolErrorLog, // NOTE: folder must exist and be writable...
    fileNamePattern: "school-<DATE>.log",
    dateFormat: "YYYY.MM.DD",
    level: "trace",
};
var SimpleLogger = require("simple-node-logger"),
    manager = new SimpleLogger({ errorEventName: "error" });

manager.createConsoleAppender();
manager.createRollingFileAppender(opts);

module.exports = manager.createLogger("questioncloudbapi", "trace");
