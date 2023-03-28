import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import firebase from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, addDoc, Timestamp} from "firebase/firestore";
import  { db } from '../lib/firebase'
import { UserContext } from '../contexts/userContexts'


export const RegisterScreen = ( { navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const {setUser} = userContext(UserContext)

  //登録
  const handleRegister = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=> {
      // Signed in
        const uid = userCredential.user.uid;
        data = {
          user_id: uid,
          country: "",
          email: email,
          passord: password,
          displayName: "仮名まだなし",
          displayMap: false,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }
        setDoc(doc(db, "users", uid), data);
        navigation.navigate('Profile');
        const docRef = addDoc(collection(db, "users"), {
        })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <Button
        title="Login"
        onPress={handleRegister}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
});