import React, { useState } from 'react';
import { View, TextInput, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { query, collection, doc, updateDoc, where, getDocs } from "firebase/firestore";
import { db, auth, handleUploadPhoto } from '../lib/firebase'
import { pickImage } from '../lib/image-picker'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getExtention } from "../lib/file";

// const storage = getStorage();
// const storageRef = ref(storage, 'スクリーンショット 2023-03-03 20.08.14.png');

export const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState(null);

  const handleSaveProfile = async () => {
    // プロフィールを保存する処理
    const userId = auth.currentUser.uid;
    console.log(userId);

    const q = query(collection(db, "users"), where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);

    let currentId = null;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      currentId = doc.id;
    });
    const washingtonRef = doc(db, "users", currentId);
    await updateDoc(washingtonRef, {
      displayname: true,
      imageUrl: photoUrl
    });
    const profileImage = await handleUploadPhoto(photoUrl);

  };

  //
  const onPickImage = async () => {
    const uri = await pickImage();
    setPhotoUrl(uri);
  };

  return (
    <View >
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={(value) => setName(value)}
        style={{ marginVertical: 10, width: '80%', padding: 10, borderWidth: 1, borderRadius: 5 }}
      />
      {photoUrl && (
        <Image
          source={{ uri: photoUrl }}
          style={{ width: 200, height: 200, marginVertical: 10 }}
        />
      )}

      <Button title="Choose Photo" onPress={onPickImage} />
      <Button title="Save Profile" onPress={handleSaveProfile} />
    </View>
  );
};


