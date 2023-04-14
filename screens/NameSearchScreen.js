import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db, auth, getFolloweredUsersData, deleteFollow, blockUserData, getSearchName } from '../lib/firebase'
import { doc, setDoc, collection, updateDoc, Timestamp, arrayUnion, getDoc } from "firebase/firestore";
import React, { useEffect, useState, useRef } from 'react';
import { ButtunPrompt } from '../components/ButtunPrompt';
import { useDispatch, useSelector } from 'react-redux';
import { storeBlockUsers } from '../store/userSlice';

export const NameSearchScreen = ({ navigation }) => {
    const [userName, setName] = useState('');

    //名前検索
    const handleSearchName = async () => {
        const user = await getSearchName(userName);
        navigation.navigate('List', { user: user });
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.idContainer}>
                <TextInput
                    value={userName}
                    placeholder="検索したい名前"
                    onChangeText={(value) => setName(value)}
                    style={styles.input}
                />
                <ButtunPrompt
                    action="名前検索"
                    onPress={handleSearchName}
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    idContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
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
});
