const db = require("../Models");

db.sequelize
    .authenticate()
    .then(() => console.log("Connection has been established successfully."))
    .catch((err) => console.error("Unable to connect to the database:", err));

process.on("SIGINT", async () => {
    await db.sequelize.close().then(() => console.log("Connection Closed"));
    process.exit(0);
});

/*
db.sequelize.on("connect", () => {
    console.log("Database Connected Successfully");
});
db.sequelize.on("error", handleConnectionError);
db.sequelize.on("error", (err) => {
    console.log("Database Error : ", err);
});
*/
