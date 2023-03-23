// import firebase from "firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, doc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getExtention } from "../lib/file";

 export const firebaseConfig = {
    apiKey: "AIzaSyCx7y1t6Co3BkXsgvZp6ZemiaZPspdhdXk",
    authDomain: "shop-57d77.firebaseapp.com",
    databaseURL: "https://shop-57d77-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "shop-57d77",
    storageBucket: "shop-57d77.appspot.com",
    messagingSenderId: "480257516297",
    appId: "1:480257516297:web:1bc6459aecbcb6b2d9e9d8",
    measurementId: "G-8WXQWPW3Q5"
};

// 基礎設定
export const app = initializeApp(firebaseConfig);

//認証
export const auth = getAuth();

//firestore(DB)
export const db = getFirestore(app);

//ストレージ
export const storage = getStorage(app);

 

    // ストレージにアップロードする処理
export const handleUploadPhoto = async (photoUrl) => {
    if (!photoUrl) {
      return;
    }
    const ext = getExtention(photoUrl);
    const storagePath = `profileImage/${new Date().getTime()}.${ext}`;
    const storage = getStorage();

    try {
      const blob = await fetch(photoUrl).then((response) => response.blob());
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      console.log("Uploaded a blob or file!", downloadUrl);
      return downloadUrl;
    } catch (e) {
      console.error(e);
    }
  };