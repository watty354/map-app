import React, { useId, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import firebase from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, addDoc} from "firebase/firestore";
import  { db } from '../lib/firebase'


export const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin =() => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        console.log('User signed in!');
        const user = userCredential.user;
        console.log(user);
        const docRef = addDoc(collection(db, "users"), {
          name: "Tokyo",
          country: "Japan",
          useId: user.uid
        })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
          navigation.navigate('MapTab');
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
    <Text>Login</Text>
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
        onPress={handleLogin}
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