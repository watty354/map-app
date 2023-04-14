// import firebase from "firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, query, where, updateDoc, Timestamp, or, arrayRemove, deleteDoc, arrayUnion, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getExtention } from "../lib/file";
import { Alert } from 'react-native';

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
// テスト用全員を取得
// export const getAllUsers = async () => {
//   const querySnapshot = await getDocs(collection(db, 'users'));
//   const users = [];
//   querySnapshot.forEach((doc) => {
//     users.push(doc.data());
//   });
//   return users;
// };

//ID検索でデータを得る
export const getUserData = async (name) => {
  const q = query(collection(db, 'users'), where('user_id', '==', name));
  const querySnapshot = await getDocs(q);
  const userData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))[0]; // 配列からオブジェクトを取得
  console.log("getUserData");
  return userData;
};

//ID検索でデータを得る(複数)
export const getUseresData = async (userId) => {
  if (userId.length === 0) {
    return [];
  }
  const q = query(collection(db, 'users'), where('user_id', 'in', userId));
  const querySnapshot = await getDocs(q);
  const useresData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log("getUseresData");
  return useresData;
};


//名前検索(displayName)
export const getSearchName = async (name) => {
  const q = query(collection(db, 'users'), where('displayName', '==', name));
  const querySnapshot = await getDocs(q);
  const usersData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log("getSearchName");
  return usersData;
};

//共有しているユーザのみ取得
export const getMapUsersData = async () => {
  const q = query(collection(db, 'users'), where('displayMap', '==', true));
  const querySnapshot = await getDocs(q);
  const usersData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log("getMapUsersData");
  return usersData;
};

//フォローした人のID取得
export const getFolloweredUsersData = async () => {
  const userId = auth.currentUser.uid;
  const q = query(collection(db, "follow"), where("follower_id", "==", userId));
  const querySnapshot = await getDocs(q);
  const followedIds = querySnapshot.docs.map((doc) => doc.data().followed_id);
  console.log("getFolloweredUsersData");
  return followedIds;
};

//フォロー申請した人のデータを取得
export const getFollowedData = async () => {
  const followedIds = await getFollowedId();

  if (followedIds.length === 0) {
    return [];
  }
  const q2 = query(collection(db, 'users'), where('user_id', 'in', followedIds));
  const querySnapshot2 = await getDocs(q2);
  const usersData = querySnapshot2.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log("getFollowedData");
  return usersData;
};

//フォロー申請された人のIdを取得
export const getFollowedId = async () => {
  const followedIds = [];
  const userId = auth.currentUser.uid;
  const q = query(collection(db, "follow"), where("followed_id", "array-contains", userId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    followedIds.push(doc.data().follower_id);
  });
  const filteredFollowedIds = followedIds.filter(id => id !== userId);
  console.log("getFollowedId");
  return filteredFollowedIds;
}

//new Mapで表示する人の取得
export const getMapFollowUsersData = async () => {

  //相互フォローを取得
  const followIds = await getFolloweredUsersData();
  const followedIds = await getFollowedId();
  const matchingIds = followedIds.filter(id => followIds[0].includes(id));
  if (matchingIds.length === 0) {
    return [];
  }

  const q = query(collection(db, "users"), where("user_id", "in", matchingIds));
  const querySnapshot = await getDocs(q);
  const usersData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log("getMapFollowUsersData");
  return usersData;
};

// 相互フォローしてるIDを取得
export const getMatchingIds = async () => {

  //相互フォローを取得
  const followIds = await getFolloweredUsersData();
  const followedIds = await getFollowedId();
  if (followIds.length === 0) {
    return [];
  }
  const matchingIds = followedIds.filter(id => followIds[0].includes(id));
  console.log("getMatchingIds");
  return matchingIds;
};

// フォロー解除
export const deleteFollow = async (uid, userId) => {
  const followRef = doc(db, 'follow', uid);
  await updateDoc(followRef, {
    followed_id: arrayRemove(userId)
  });
  console.log("deleteFollow");
}

//ログインしているユーザのみ取得
export const getLoginUsersData = async () => {
  const userId = auth.currentUser.uid;
  const q = query(collection(db, "users"), where("user_id", "==", userId));
  const querySnapshot = await getDocs(q);
  const usersData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))[0];
  console.log("getLoginUsersData");
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
  console.log("mapDisplayNone");
};

// // プロフィールを保存(更新)する処理
export const mapDisplay = async (latitudeNow, longitudeNow) => {
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
  console.log("mapDisplay");
};

//チャットをしているユーザーの取得
export const getChatUsersData = async (uid) => {
  const q = query(
    collection(db, "chats"),
    or(
      where("talkId", "array-contains", uid),
      where("receiverId", "==", uid),
    )
  );
  const querySnapshot = await getDocs(q);

  const chatData = [];
  querySnapshot.forEach((documentSnapshot) => {
    const data = documentSnapshot.data();
    const receiverId = data.receiverId;
    const senderId = data.senderId;
    if (receiverId !== uid) {
      chatData.push(receiverId);
    } else if (senderId !== uid) {
      chatData.push(senderId);
    }
  });

  if (chatData.length === 0) {
    return [];
  }

  const q2 = query(collection(db, "users"), where("user_id", "in", chatData));
  const querySnapshot2 = await getDocs(q2);
  const usersData = querySnapshot2.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log("getChatUsersData");
  return usersData;
}
//チャットを送ったユーザーのID取得
export const getSendUsersData = async (uid) => {
  const q = query(collection(db, "chats"), where("receiverId", "==", uid));
  const querySnapshot = await getDocs(q);
  // const usersIds = querySnapshot.docs.map((doc) => ({
  //   id: doc.id,
  //   ...doc.data.senderId,
  // }));
  const senderIds = querySnapshot.docs.map((doc) => doc.data().senderId);
  console.log("getSendUsersData");
  return senderIds;

}

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
    console.log("handleUploadPhoto");
    return downloadUrl;
  } catch (e) {
    console.error(e);
  }
};

// ストレージにある画像を削除する処理
export const handleDeletePhoto = async (photoUrl) => {
  if (!photoUrl) {
    return;
  }
  const storage = getStorage();

  try {
    const storageRef = ref(storage, photoUrl);
    await deleteObject(storageRef);
    console.log("handleDeletePhoto");
  } catch (e) {
    console.error(e);
  }
};

//写真の更新処理
export const imageStore = async (beforeImage, image) => {
  //ストレージに保存・削除処理
  if (beforeImage) {
    await handleDeletePhoto(beforeImage);
  }
  const imageurl = await handleUploadPhoto(image);

  // プロフィールを保存(更新)する処理
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
    imageUrl: imageurl,
    displayMap: false,
    updatedAt: Timestamp.now(),
  });
  console.log("imageStore");

  return imageurl;
};

// ユーザーを削除する処理
export const DeleteUserData = async (userData) => {

  // 関連DBの削除
  await deleteDoc(doc(db, "users", userData.user_id));
  await deleteDoc(doc(db, "follow", userData.user_id));
  const chatsRef = collection(db, 'chats');
  const receiverQuery = query(chatsRef, where('receiverId', '==', userData.user_id));
  const senderQuery = query(chatsRef, where('senderId', '==', userData.user_id));

  const receiverSnapshot = await getDocs(receiverQuery);
  const senderSnapshot = await getDocs(senderQuery);

  // Delete documents where the user is the receiver
  receiverSnapshot.docs.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });

  // Delete documents where the user is the sender
  senderSnapshot.docs.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
  console.log("DeleteUserData");

  //ストレージに保存・削除処理
  if (userData.imageUrl) {
    await handleDeletePhoto(userData.imageUrl);
  }
  const deleteDocs = async (querySnapshot) => {
    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, 'chats', docSnapshot.id));
    });
  };


  // アカウント認証情報の削除
  const user = auth.currentUser;

  user.delete().then(() => {
    return;
  }).catch((error) => {
    Alert.alert('正常に削除できませんでした。もう一度再起動してやり直してください');
  });
};

//ユーザーブロック
export const blockUserData = async (blockUserId, chatId) => {
  const userId = auth.currentUser.uid;

  // 関連DBの削除
  await deleteDoc(doc(db, "chats", chatId));
  const userFollowDocRef = doc(db, "follow", userId);
  await updateDoc(userFollowDocRef, {
    followed_id: arrayRemove(blockUserId),
  });
  const washingtonRef = doc(db, "users", userId);
  await updateDoc(washingtonRef, {
    blockUserId: arrayUnion(blockUserId),
    updatedAt: Timestamp.now(),
  });

};

export const getBlockedUser = async () => {
  const userId = auth.currentUser.uid;

  const userDocRef = doc(db, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);

  // ドキュメントが存在し、blockUserIdがある場合は配列を返す
  if (userDocSnap.exists() && userDocSnap.data().blockUserId) {
    console.log("getBlockedUser");
    return userDocSnap.data().blockUserId;
  } else {
    return [];
  }
  
};

//報告フォーム
export const storeFormSend = async (option, text, name) => {
  const uid = auth.currentUser.uid;
  // const nowTime = Timestamp.now();
  const nowTime = new Date();;

  const content = option === "bug_report" ? "バグ報告" : "不審なユーザ";
  const data =  {
    id: uid,
    name: name,
    option: content,
    text: text,
    createdAt: Timestamp.now(),
  };
  console.log("storeFormSend");

  await setDoc(doc(db, "form", uid), data);
};


// マッチしたらマッチIDを付与

export const addMatch = async (userId, youId) => {
  const uid = auth.currentUser.uid;
  // const nowTime = Timestamp.now();
  const nowTime = new Date();;

  const content = option === "bug_report" ? "バグ報告" : "不審なユーザ";
  const data =  {
    id: uid,
    name: name,
    option: content,
    text: text,
    createdAt: Timestamp.now(),
  };
  console.log("storeFormSend");

  await setDoc(doc(db, "form", uid), data);
};
