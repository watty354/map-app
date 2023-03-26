// import firebase from "firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, query, where, updateDoc, Timestamp} from "firebase/firestore";
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

// ＜＝＝＝＝＝＝＝＝＝＝＝＝＝＝以下関数＝＝＝＝＝＝＝＝＝＝＝＝＞
// ストレージに画像をアップロードする処理
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

  //共有しているユーザのみ取得
  export const getMapUsersData = async () => {
    const q = query(collection(db, 'users'), where('displayMap', '==', true));
    const querySnapshot = await getDocs(q);
    const usersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return usersData;
  };
  //ログインしているユーザのみ取得
  export const getLoginUsersData = async () => {
    const userId = auth.currentUser.uid;
    const q = query(collection(db, "users"), where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);
    const usersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return usersData;
  };

  // // プロフィールを保存(更新)する処理
  export const mapDisplayNone = async () => {
    const userId = auth.currentUser.uid;
    const q = query(collection(db, "users"), where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);
  
    let currentId = null;
    querySnapshot.forEach((doc) => {
      currentId = doc.id;
    });
    const washingtonRef = doc(db, "users", currentId);
    await updateDoc(washingtonRef, {
      displayMap: false,
      updatedAt: Timestamp.now(),
    });
  };

  // // プロフィールを保存(更新)する処理
  export const mapDisplay = async (latitudeNow, longitudeNow)  => {
    const userId = auth.currentUser.uid;
    const q = query(collection(db, "users"), where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);
  
    let currentId = null;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      currentId = doc.id;
    });
    const washingtonRef = doc(db, "users", currentId);
    await updateDoc(washingtonRef, {
      displayMap: true,
      latitude: latitudeNow,
      longitude: longitudeNow,
      updatedAt: Timestamp.now(),
    });
  };