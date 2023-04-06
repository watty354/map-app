import { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { db, getLoginUsersData, getSearchName, auth, imageStore, getUseresData, getMatchingIds, getFolloweredUsersData, getFollowedId } from '../lib/firebase'
import { pickImage } from '../lib/image-picker'
import { ButtunPrompt } from '../components/ButtunPrompt'
import QRCode from 'react-native-qrcode-svg';
import { useDispatch, useSelector } from 'react-redux';
import { storeUserId, storeImage, storeName } from '../store/userSlice';

export const AccuntScreen = ({ navigation }) => {
    const [loginUsersData, setLoginUsersData] = useState([]);
    const [loginUserName, setLoginUserName] = useState("");
    const [loginUserImage, setLoginUserImage] = useState("");
    const [loginUserId, setLoginUserId] = useState("");
    const [userName, setName] = useState('');
    const action = "Accunt";

    const dispatch = useDispatch();
    const clipUserId = useSelector((state) => state.user.userId);
    const clipName = useSelector((state) => state.user.displayName);
    const clipImage = useSelector((state) => state.user.displayImage);

    //ログインしてるユーザを取得
    useEffect(() => {
        const fetchLoginUsersData = async () => {
            const data = await getLoginUsersData();
            console.log("実行されてないよね！");
            dispatch(storeUserId(data.user_id));
            dispatch(storeName(data.displayName));
            dispatch(storeImage(data.imageUrl));
            setLoginUserId(data.user_id);
            setLoginUserName(data.displayName);
            setLoginUserImage(data.imageUrl);
            setLoginUsersData(data);
            if (!data.imageUrl){
                Alert.alert('写真を設定して下さい');
            }
        };
        if (clipUserId && clipName && clipImage) {
            setLoginUserId(clipUserId);
            setLoginUserName(clipName);
            setLoginUserImage(clipImage);
        } else {
            fetchLoginUsersData();
        }
    }, []);

    // useEffect(() => {
    //     if (loginUsersImage === '') {
    //         console.log(loginUsersImage);
    //         Alert.alert('写真を設定して下さい');
    //     }
    // }, [loginUsersImage]);


    // 友達（相互フォロー）リストへ遷移
    const handleFrienfList = async () => {
        const matchingIds = await getMatchingIds();
        const user = await getUseresData(matchingIds);
        navigation.navigate('List', { user: user });
    };

    // フォロー申請画面に遷移するハンドラー
    const handleFollowRequest = async () => {
        // フォローされた人
        const followedUser = await getFollowedId();
        // フォローした人
        const originalFollowIds = await getFolloweredUsersData();
        const followIds = originalFollowIds.flat();

        // フォローした人は除く
        const userIds = followedUser.filter(userId => !followIds.includes(userId));
        const user = await getUseresData(userIds);

        navigation.navigate('List', { user: user });
    };

    //名前検索
    const handleSearchName = async () => {
        const user = await getSearchName(userName);
        navigation.navigate('List', { user: user });
    }

    // ログインしていない場合はログインページにリダイレクト
    // if (!loginUsersData) {
    //     navigation.navigate('Home');
    // }

    const onPickImage = async () => {
        const uri = await pickImage();
        if (!uri) {
            return;
        }
        const beforeUri = loginUserImage ? loginUserImage : null;
        await imageStore(beforeUri, uri);
        // const data = await getLoginUsersData();
        // setLoginUsersData(data)
        dispatch(storeImage(uri));
        setLoginUserImage(uri);

    };

    return (
        <ScrollView>

            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <TouchableOpacity onPress={onPickImage}>
                        {loginUserImage ? (
                            <Image source={{ uri: loginUserImage }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarPlaceholderText}>写真を選択</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <Text style={styles.name}>{loginUserName}</Text>
                    {/* <QRCodeGenerator userId={uid} /> */}
                    <View style={styles.qrCode}>

                    {loginUserId && <QRCode value={loginUserId} size={200} style={styles.qrCode} />}
                    </View>
                    <ButtunPrompt
                        action="QR読み取り"
                        onPress={() => navigation.navigate('QRCode')}
                    />
                </View>

                <View style={styles.fliendContainer}>
                    <ButtunPrompt
                        action="友達一覧"
                        onPress={handleFrienfList}
                    />
                    <ButtunPrompt
                        action="フォロー申請一覧"
                        onPress={handleFollowRequest}
                    />
                </View>

                <View style={styles.idContainer}>
                    <TextInput
                        value={userName}
                        onChangeText={(value) => setName(value)}
                        style={styles.input}
                    />
                    <ButtunPrompt
                        action="名前検索"
                        onPress={handleSearchName}
                    />
                </View>



                <View style={styles.anatherContainer}>
                    <ButtunPrompt
                        action="５秒でわかる使い方"
                        onPress={() => navigation.navigate('Usage', { action: action })}
                    />
                </View>
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginTop: 100,
        marginBottom: 150,
    },
    subContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    idContainer: {
        marginBottom: 50,
        width: '100%',
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E1E2E6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholderText: {
        color: '#ABB1B7',
        fontSize: 16,
    },
    name: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    email: {
        marginTop: 8,
        fontSize: 16,
        color: '#AEB5BC',
    },
    loginButton: {
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
    loginButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    followButton: {
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
    qrCode: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    fliendContainer: {
        marginBottom: 36,
    }
});

