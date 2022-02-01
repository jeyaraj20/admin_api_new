const mongoose = require('mongoose');
// const log = require('./log');
// const config = require(__dirname + '/../config/config.json')[env];
// const env = process.env.NODE_ENV || 'development';

const dbURI = 'mongodb://' + "localhost" + ':' + "27017" + '/' + "qccloud";
console.log(dbURI)
mongoose.connect(dbURI, { useNewUrlParser: true });

mongoose.connection.on('connected', function () {
    // log.info({ Function: "db" }, 'Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    // log.info({ Function: "db" }, 'Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    // log.info({ Function: "db" }, 'Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        // log.info({ Function: "db" }, 'Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});