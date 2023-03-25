import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
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
    //ストレージに保存処理
    const profileImage = await handleUploadPhoto(photoUrl);

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
      displayName: name,
      imageUrl: profileImage,
      displayMap: false,
      latitude: 34.665442,
      longitude: 135.516912
    });

  };

  //
  const onPickImage = async () => {
    const uri = await pickImage();
    setPhotoUrl(uri);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPickImage}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>写真を選択</Text>
          </View>
        )}
      </TouchableOpacity>
        <TextInput
          placeholder="表示される名前"
          value={name}
          onChangeText={(value) => setName(value)}
          style={{ marginVertical: 10, width: '80%', padding: 10, borderWidth: 1, borderRadius: 5 }}
        />
      <Button title="Save Profile" onPress={handleSaveProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E1E2E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: '#ABB1B7',
    fontSize: 16,
  },
  name: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '600',
  },
  email: {
    marginTop: 8,
    fontSize: 16,
    color: '#AEB5BC',
  },
});


