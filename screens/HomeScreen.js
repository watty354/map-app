import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { ImagePickerComponent } from '../lib/image-picker';
import * as pickImage from 'expo-image-picker';

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


export const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Open on your app!</Text>
            <Button
                title="新規作成"
                onPress={() => navigation.navigate('Register')}
            />
            <Button
                title="ログイン"
                onPress={() => navigation.navigate('Login')}
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
});
