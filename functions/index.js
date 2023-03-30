const functions = require("firebase-functions");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// const admin = require("firebase-admin");
// admin.initializeApp();

// exports.onDisplayMapChanged = functions.firestore
//     .document("users/{userId}")
//     .onUpdate((change, context) => {
//     //   const userId = context.auth.uid;
//       const displayMap = change.after.data().displayMap;
//       if (displayMap) {
//         setTimeout(() => {
//           change.after.ref.update({displayMap: false});
//         }, 5000);
//       }
//       return null;
//     });
