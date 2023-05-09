/* eslint-disable no-undef */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const {Expo} = require("expo-server-sdk");
// eslint-disable-next-line prefer-const
const expo = new Expo();

// eslint-disable-next-line max-len, max-len
exports.sendNotificationOnMessageReceived = functions.region("asia-northeast2").firestore
    .document("chats/{chatId}")
    .onUpdate(async (change, context) => {
      const receiverId = change.after.data().receiverId;

      // ユーザ情報を取得する
      // eslint-disable-next-line max-len
      const userDoc = await db.collection("users").doc(receiverId).get();
      const userData = userDoc.data();
      const pushToken = userData.expoPushToken;


      if (!Expo.isExpoPushToken(pushToken)) {
        // eslint-disable-next-line max-len
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        return;
      }

      const notification = {
        to: pushToken,
        sound: "default",
        title: "nominau",
        body: "新しいメッセージが届きました",
      };

      try {
        await expo.sendPushNotificationsAsync([notification]);
      } catch (error) {
        console.error("Failed to send push notification:", error);
      }
    });

// eslint-disable-next-line require-jsdoc
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.onDisplayMapChanged = functions.region("asia-northeast2").firestore
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
