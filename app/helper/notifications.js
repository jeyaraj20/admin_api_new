const admin = require("firebase-admin");
const path = require("path");
const pathToServiceAccount = path.resolve("./question-cloud-firebase-adminsdk-xe445-c62e54f76f.json");
const serviceAccount = require(pathToServiceAccount);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://question-cloud.firebaseio.com",
});

module.exports = {
    // 1. Push Notification for topics
    pushNotificationByTopic: (topic, title, body) => {
        var message = {
            notification: { title, body },
            topic: topic,
        };

        // Send a message to the device corresponding to the provided
        // registration token.
        admin
            .messaging()
            .send(message)
            .then((response) => {
                // Response is a message ID string.
                console.log("Successfully sent message:", response);
            })
            .catch((error) => {
                console.log("Error sending message:", error);
            });
    },

    // 2. Push Notification for single user
    pushNotificationToUser: () => {
        // This registration token comes from the client FCM SDKs.
        var registrationToken =
            "AAAA-NCXp-Y:APA91bGbbeScD9leuMnI03N4GuDkIIZ1AJ98mX-m_TKAjcXIF7Z5TUkCwIIReznzdiElBU98ImFwcBGg3J9FWUV16LALIsF2FLXUlrZmEvmOPbFv0oZwP0IJrYg5Hbny_mXo47cNNi2n";
        var message = {
            notification: { title: "850", body: "2:45" },
            token: registrationToken,
        };

        // Send a message to the device corresponding to the provided
        // registration token.
        admin
            .messaging()
            .send(message)
            .then((response) => {
                // Response is a message ID string.
                console.log("Successfully sent message:", response);
            })
            .catch((error) => {
                console.log("Error sending message:", error);
            });
    },
};
