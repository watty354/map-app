import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import { ButtunPrompt } from '../components/ButtunPrompt'
import { LoginScreen } from '../screens/RegisterScreen'
import Ionicons from '@expo/vector-icons/Ionicons';
import { reload } from 'firebase/auth';

export const HomeScreen = ({ navigation }) => {

    const handleRegister = () => {
        navigation.navigate('Register');
    };
    const handleLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
                <Ionicons name="beer" size={80} style={styles.icon} />
                <ButtunPrompt
                    action="ログイン"
                    onPress={() => navigation.navigate('Login')}
                    // onPress={() => handleLogin}
                // style={styles.login}
                />
            <ButtunPrompt
                action="新規作成"Ï
                onPress={() => navigation.navigate('Register')}
                // onPress={() => handleRegister}
                style={styles.login}
            />
            <ButtunPrompt
                action="５秒でわかる使い方"
                onPress={() => handleLogin}
                style={styles.use}
            />
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
    },
    use: {
        marginTop: 50,
        backgroundColor: '#fff',
    },
    icon: {
        marginBottom: 50,
        color: "#EB6383",
      },
});
