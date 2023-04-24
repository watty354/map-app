const functions = require("firebase-functions");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// const admin = require("firebase-admin");
// admin.initializeApp();
// eslint-disable-next-line require-jsdoc
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.onDisplayMapChanged = functions.firestore
    .document("users/{userId}")
    .onUpdate(async (change, context) => {
      try {
        const displayMap = change.after.data().displayMap;
        if (displayMap) {
          await sleep(7200000);
          change.after.ref.update({displayMap: false});
        }
      } catch (error) {
        console.error("Error in function: ", error);
      }
      return null;
    });
