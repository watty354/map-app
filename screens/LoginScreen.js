import React, { useId, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { db } from '../lib/firebase'
import { ButtunPrompt } from '../components/ButtunPrompt'


export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {

    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {

        // Signed in
        console.log('User signed in!');
        navigation.navigate('Map');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        if (errorCode === 'auth/invalid-email') {
          Alert.alert('エラー', 'メールアドレスが違うらしい');
        } else if (errorCode === 'auth/wrong-password') {
          Alert.alert('エラー', 'パスワードが違うらしい');
        } else if (errorCode === 'auth/user-not-found') {
          Alert.alert('エラー', '何にも一致しませんでした。。。');
        } else {
          Alert.alert(errorMessage);
        }
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

      <ButtunPrompt
        action="ログインする"
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