import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';

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
