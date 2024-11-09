const admin = require("firebase-admin");
const serviceAccount = require("./petify-e841c-firebase-adminsdk-xmnal-b592a2feef.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
