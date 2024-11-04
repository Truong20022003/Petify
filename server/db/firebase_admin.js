const admin = require("firebase-admin");
const serviceAccount = require("./petify-e841c-firebase-adminsdk-xmnal-c2ce2df224.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
