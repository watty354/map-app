import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import { ButtunPrompt } from '../components/ButtunPrompt'
import { LoginScreen } from '../screens/RegisterScreen'
import Ionicons from '@expo/vector-icons/Ionicons';
import { reload } from 'firebase/auth';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { db, auth } from '../lib/firebase'
import { useDispatch, useSelector } from 'react-redux';
import { storePass, storeEmail} from '../store/userSlice';

export const HomeScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const action = "Home"
    const dispatch = useDispatch();
    const clipEmail = useSelector((state) => state.user.email);
    const clipPass = useSelector((state) => state.user.password);

    useEffect(() => {
        if (clipEmail && clipPass) {
          setEmail(clipEmail);
          setPassword(clipPass);
        }
      }, []);

    // ログイン処理
    const handleLogin = () => {
        dispatch(storeEmail(email));
        dispatch(storePass(password));
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                console.log('User signed in!');
                // navigation.navigate('AccuntTab');
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
// console.log(clipEmail);
    return (
        <View style={styles.container}>
            <Ionicons name="beer" size={80} style={styles.icon} />
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
                action="実験"
                onPress={testTest}
            />
            <ButtunPrompt
                action="ログインする"
                onPress={handleLogin}
            />
            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>アカウントを持ってない方はこちら</Text>
                <ButtunPrompt
                    action="新規作成"
                    onPress={() => navigation.navigate('Register')}
                    style={styles.login}
                />
            </View>
            <View style={styles.anatherContainer}>
                <ButtunPrompt
                    action="５秒でわかる使い方"
                    onPress={() => navigation.navigate('Usage', { action: action })}
                />
            </View>
            <StatusBar style="auto" />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    anatherContainer: {
        marginTop: 10,
        backgroundColor: '#fff',
    },
    icon: {
        marginBottom: 50,
        color: "#EB6383",
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
    signupText: {
        textAlign: 'center',
        color: '#EB6383',
        fontSize: 14,
        // marginVertical: 10,
        marginRight: 10,
    },
    signupContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
});
