import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Alert, TextInput, TouchableOpacity } from 'react-native';
import { ButtunPrompt } from '../components/ButtunPrompt'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db, auth, savePush } from '../lib/firebase'
import { useDispatch, useSelector } from 'react-redux';
import { storePass, storeEmail, storePushToken } from '../store/userSlice';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import Ionicons from '@expo/vector-icons/Ionicons';
import { registerForPushNotificationsAsync } from '../lib/notification'

export const HomeScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const action = "Home"
    const dispatch = useDispatch();
    const clipEmail = useSelector((state) => state.user.email);
    const clipPass = useSelector((state) => state.user.password);
    const clipPushToken = useSelector((state) => state.user.pushToken);

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
            .then(async (userCredential) => {
                // Signed in
                console.log('User signed in!');
                const pushToken = await registerForPushNotificationsAsync();
                if (clipPushToken) {
                    if (pushToken != clipPushToken) {
                        await savePush(pushToken);
                        dispatch(storePushToken(pushToken));
                    }
                } else {
                    await savePush(pushToken);
                    dispatch(storePushToken(pushToken));
                }
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
            <Image source={require('../image/homeLogo.png')} style={styles.logo} />
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
        marginTop: 32,
    },
    logo: {
        // position:'absolute',
        // top: 150,
        marginBottom: 25,
        width: 300, // 画像の幅
        height: 150,
        resizeMode: 'contain', // 画像を縮小せずにフィット
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
