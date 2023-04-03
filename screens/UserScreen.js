import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { db, auth, getFolloweredUsersData } from '../lib/firebase'
import { doc, setDoc, collection, updateDoc, Timestamp, arrayUnion, getDoc } from "firebase/firestore";
import React, { useEffect, useState, useRef } from 'react';
import { async } from '@firebase/util';

export const UserScreen = ({ route }) => {
    const { user } = route.params;
    const [isFollowed, setIsFollowed] = useState(false);

    //フォローの確認
    useEffect(() => {
        const isFollowedConfirmation = async () => {
            const followedarray =  await getFolloweredUsersData();
            if (followedarray.some(innerArray => innerArray.includes(user.user_id))) {
                setIsFollowed(true);
            }
        }
        isFollowedConfirmation();
    }, [user]);

    // フォロー申請処理
    const handleFollow = async () => {
        const uid = auth.currentUser.uid;
        const followDocRef = doc(db, "follow", uid);
        const followDoc = await getDoc(followDocRef);
        if (!followDoc.exists()) {
          await setDoc(followDocRef, {});
        }
        //フォローTBL登録
        const data = {
            follower_id: uid,
            followed_id: arrayUnion(user.user_id),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        }
        await updateDoc(followDocRef, data);
        setIsFollowed(true)
    };

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

            {isFollowed ? (
                <TouchableOpacity style={styles.followedButton} >
                    <Text style={styles.ButtonText}>フォローしてるで</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.followButton} onPress={handleFollow} >
                    <Text style={styles.ButtonText}>フォローする</Text>
                </TouchableOpacity>
            )}
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
});
