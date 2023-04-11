import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db, auth, getFolloweredUsersData, DeleteUserData } from '../lib/firebase'
import { doc, setDoc, collection, updateDoc, Timestamp, arrayUnion, getDoc } from "firebase/firestore";
import React, { useEffect, useState, useRef } from 'react';
import { async } from '@firebase/util';
import { ButtunPrompt } from '../components/ButtunPrompt'
import { useDispatch } from 'react-redux';
import { storeUserId, storeImage, storeName, storeEmail, storePass } from '../store/userSlice';

export const DeleteUserScreen = ({ route }) => {
    const { user } = route.params;
    const dispatch = useDispatch();

    const uid = auth.currentUser.uid;
    //削除ボタン押下アクション
  const handleDeleteUser = () => {
      Alert.alert('削除', '本当に削除しますか？データは復元されません。', [
        {
          text: 'キャンセル',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: DeleteUser}
      ]);
  }
    

    const DeleteUser = async () => {
        await DeleteUserData(user);
        Alert.alert('削除されました');

        dispatch(storeUserId(""));
        dispatch(storeName(""));
        dispatch(storeImage(""));
        dispatch(storeEmail(""));
        dispatch(storePass(""));
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity>
                {user?.imageUrl ? (
                    <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
                ) : (

                    <Image source={require('../image/NoneImage.png')} style={styles.avatar} />
                )}
                {/* <Image source={{ uri: user.imageUrl }} style={styles.avatar} /> */}
            </TouchableOpacity>
            <Text style={styles.name}>{user.displayName}</Text>
            
                <View style={styles.subContainer}>
                    <ButtunPrompt
                        action="アカウントを削除する"
                        onPress={handleDeleteUser}
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
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        margin: 12,
        fontSize: 16,
        fontWeight: '600',
    },
    followButton: {
        marginBottom: 5,
        backgroundColor: '#EB6383',
        paddingVertical: 10,
        paddingHorizontal: 100,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    ButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    followedButton: {
        marginBottom: 5,
        backgroundColor: '#FA9191',
        paddingVertical: 10,
        paddingHorizontal: 100,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    subContainer :{
        alignItems: 'center',
    }
});
