import React, { useState } from 'react';
import { View, TextInput, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import  { db, auth } from '../lib/firebase'
import { pickImage } from '../lib/image-picker'

export const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState(null);

  const handleSaveProfile = () => {
    // プロフィールを保存する処理
    const userId = auth.currentUser.uid;
    console.log();
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


