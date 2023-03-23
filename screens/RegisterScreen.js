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
  const handleRegister =() => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
        const user = userCredential.user;
        console.log(user);
        const docRef = addDoc(collection(db, "users"), {
          user_id: user.uid,
          name: "",
          country: "",
          email: email,
          passord: password,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        })
        .then((docRef) => {
          console.log('Register Success:', user);
          // setUser(user);
          navigation.navigate('Profile');
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
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