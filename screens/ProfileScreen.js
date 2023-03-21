import React, { useState } from 'react';
import { View, TextInput, Button, Image } from 'react-native';
import { ImagePickerComponent } from '../lib/image-picker';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";


const firebaseConfig = {
    apiKey: "AIzaSyCx7y1t6Co3BkXsgvZp6ZemiaZPspdhdXk",
    authDomain: "shop-57d77.firebaseapp.com",
    databaseURL: "https://shop-57d77-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "shop-57d77",
    storageBucket: "shop-57d77.appspot.com",
    messagingSenderId: "480257516297",
    appId: "1:480257516297:web:1bc6459aecbcb6b2d9e9d8",
    measurementId: "G-8WXQWPW3Q5"
};

const app = initializeApp(firebaseConfig);


export const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState(null);

  const auth = getAuth();
  const db = getFirestore(app);

  const handleSaveProfile = () => {

    console.log(name)
    console.log(photoUrl)
    // プロフィールを保存する処理
    const userId = auth.currentUser.uid;
    const ref = db.ref(`users/${userId}`);
    ref.set({
      name,
      photoUrl,
    })
      .then(() => {
        console.log('Profile saved successfully');
      })
      .catch((error) => {
        console.error('Error saving profile: ', error);
      });
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
      <ImagePickerComponent />
      {/* <Button title="Choose Photo" onPress={handleChoosePhoto} /> */}
      <Button title="Save Profile" onPress={handleSaveProfile} />
    </View>
  );
};


