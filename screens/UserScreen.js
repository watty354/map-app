import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db, auth, getFolloweredUsersData, deleteFollow, blockUserData, getBlockedUser } from '../lib/firebase'
import { doc, setDoc, collection, updateDoc, Timestamp, arrayUnion, getDoc } from "firebase/firestore";
import React, { useEffect, useState, useRef } from 'react';
import { ButtunPrompt } from '../components/ButtunPrompt';
import { useDispatch, useSelector } from 'react-redux';
import { storeBlockUsers } from '../store/userSlice';

export const UserScreen = ({ route }) => {
    const { user } = route.params;
    const [isFollowed, setIsFollowed] = useState(false);
    const uid = auth.currentUser.uid;
    const [isBlockUser, setBlockUser] = useState(false);

    const dispatch = useDispatch();
    const blockUsers = useSelector((state) => state.user.blockUsers);

    //フォローの確認
    useEffect(() => {
        const isFollowedConfirmation = async () => {
            const followedarray = await getFolloweredUsersData();
            if (followedarray.some(innerArray => innerArray.includes(user.user_id))) {
                setIsFollowed(true);
            }
        }
        isFollowedConfirmation();
    }, [user]);

    //ブロックの確認
    useEffect(() => {
        const isBlockUserConfirmation = async () => {
            if (blockUsers) {
                const isBlocked = blockUsers.includes(user.user_id);
                setBlockUser(isBlocked);
            } else {
                const nowBlockusers = await getBlockedUser();
                if (nowBlockusers) {
                    const isBlocked = nowBlockusers.includes(user.user_id);
                    setBlockUser(isBlocked);
                }
            }
        }
        isBlockUserConfirmation();
    }, [user]);

    // フォロー申請処理
    const handleFollow = async () => {
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

    const handleFollowCancel = async () => {
        await deleteFollow(uid, user.user_id);
        setIsFollowed(false)
    }

    // ブロックボタン押下アクション
    const handleBlockPress = () => {
        Alert.alert('ブロック', '本当にブロックしますか？もう二度とフォローすることができなくなります', [
            {
                text: 'キャンセル',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: blockUser },
        ]);
    }

    //ユーザーブロック処理
    const blockUser = async () => {
        const chatId = getChatId(user.user_id, auth.currentUser.uid);
        await blockUserData(user.user_id, chatId);
        dispatch(storeBlockUsers(user.user_id));
        setBlockUser(true);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity>
                {user?.imageUrl ? (
                    <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
                ) : (
                    <Image source={require('../image/NoneImage.png')} style={styles.avatar} />
                )}
            </TouchableOpacity>
            <Text style={styles.name}>{user.displayName}</Text>
            {isBlockUser ? (
                <View style={styles.blockedContainer}>
                    <Text style={styles.blockedText}>ブロック中</Text>
                </View>
            ) : isFollowed ? (
                <View style={styles.subContainer}>
                    <ButtunPrompt
                        action="フォローしてるで"
                        onPress={() => { }}
                    />
                    <ButtunPrompt
                        action="フォロー解除"
                        onPress={handleFollowCancel}
                    />
                </View>
            ) : (
                <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
                    <Text style={styles.ButtonText}>フォローする</Text>
                </TouchableOpacity>
            )}
    
            {!isBlockUser && (
                <View style={styles.blockContainer}>
                    <ButtunPrompt
                        action="ブロック"
                        onPress={handleBlockPress}
                    />
                </View>
            )}
        </View>
    );
}
const getChatId = (userId, otherUserId) => {
    if (userId < otherUserId) {
        return `${userId}-${otherUserId}`;
    } else {
        return `${otherUserId}-${userId}`;
    }
};

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
    subContainer: {
        alignItems: 'center',
    },
    blockContainer: {
        position: 'absolute',
        bottom: 5,
    }
});
