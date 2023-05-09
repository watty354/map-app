import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';
import firebase from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import { db, getSearchName } from '../lib/firebase'
import { ButtunPrompt } from '../components/ButtunPrompt'
import { CheckBox } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { storePass, storeEmail, storeName, storeUserId, storeImage} from '../store/userSlice';
import Ionicons from '@expo/vector-icons/Ionicons';
import { containsInappropriateWords } from '../lib/filterWords'


export const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const notUser = "https://firebasestorage.googleapis.com/v0/b/shop-57d77.appspot.com/o/temp%2FNoneImage.png?alt=media&token=a4b0d4ae-e139-48ea-a691-0b34042a7630";

  //登録
  const handleRegister = async () => {
    if (!isChecked) {
      Alert.alert('エラー', '規約に同意してください');
      return;
    }
    if (!name) {
      Alert.alert('エラー', 'ニックネームを決めて下さい');
      return;
    }

    //displayName重複チェック
    if (name) {
      // 不適切チェック
      if (containsInappropriateWords(name)) {
        Alert.alert('エラー', '投稿に不適切な単語が含まれています！');
        return;
      }

      // 投稿を処理する他のコード
      const followedarray = await getSearchName(name);
      if (followedarray.some(user => user.displayName === name)) {
        Alert.alert('エラー', 'ニックネームが他の人と重複してるので他のニックネームをつけて下さい');
        return;
      }
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const uid = userCredential.user.uid;
        userData = {
          user_id: uid,
          country: "",
          displayName: name,
          imageUrl: notUser,
          displayMap: false,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }
        privateData = {
          user_id: uid,
          email: email,
          password: password,
          displayName: name,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }
        setDoc(doc(db, "users", uid), userData);
        setDoc(doc(db, "private", uid), privateData);

        //reduxに保存
        
        dispatch(storeEmail(email));
        dispatch(storePass(password));
        dispatch(storeName(name));
        dispatch(storeImage(notUser));
        dispatch(storeImage(''));
        dispatch(storeUserId(uid));
        // navigation.navigate('AccuntTab');
        // const docRef = addDoc(collection(db, "users"), {
        // })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/invalid-email') {
          Alert.alert('エラー', 'メールアドレスの形式が正しくありません');
        } else if (errorCode === 'auth/weak-password') {
          Alert.alert('エラー', 'パスワード6文字以上で入力して下さい');
        } else if (errorCode === 'auth/email-already-in-use') {
          Alert.alert('エラー', 'そのユーザーはすでに存在してます');
        } else {
          alert(errorMessage);
          console.log(errorMessage)
        }
      });
  }

  //利用規約へ
  const handleLinkPress = () => {
    navigation.navigate('TermsOfService');
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <View style={styles.inputPass}>
        <TextInput
          style={styles.inputPass_input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 10 }}>
          <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={24} color="black" />
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="表示される名前(ニックネーム)"
        value={name}
        onChangeText={(value) => setName(value)}
        style={styles.input}
      />
      <View style={styles.checkboxContainer}>
        <CheckBox
          title={
            <Text>
              <Text style={styles.linkText} onPress={handleLinkPress}>
                利用規約
              </Text>
              に同意する
            </Text>
          }
          checked={isChecked}
          onPress={() => setIsChecked(!isChecked)}
          containerStyle={styles.checkbox}
          checkedColor="#FA9191"
        />
      </View>
      <ButtunPrompt
        action="新規作成"
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
    borderColor: '#FA9191',
    borderRadius: 32,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  linkText: {
    color: '#FA9191',
    textDecorationLine: 'underline',
  },
  inputPass: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#FA9191',
    borderRadius: 32,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  }, 
  inputPass_input: {
    width: '100%',
    fontSize: 16,
  }
});