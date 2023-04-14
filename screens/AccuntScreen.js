import { useState, useEffect } from 'react';
import { View, Text, Image, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, Alert, FlatList } from 'react-native';
import { db, getLoginUsersData, getSearchName, auth, imageStore, getUseresData, getMatchingIds, getFolloweredUsersData, getFollowedId } from '../lib/firebase'
import { pickImage } from '../lib/image-picker'
import { ButtunPrompt } from '../components/ButtunPrompt'
import QRCode from 'react-native-qrcode-svg';
import { useDispatch, useSelector } from 'react-redux';
import { storeUserId, storeImage, storeName } from '../store/userSlice';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SettingListItem } from "../components/SettingListItem";


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
            dispatch(storeUserId(data.user_id));
            dispatch(storeName(data.displayName));
            dispatch(storeImage(data.imageUrl));
            setLoginUserId(data.user_id);
            setLoginUserName(data.displayName);
            setLoginUserImage(data.imageUrl);
            setLoginUsersData(data);
            if (!data.imageUrl) {
                Alert.alert('写真を設定して下さい');
            }
        };
        // if (clipUserId && clipName && clipImage != "" ) {
        //     setLoginUserId(clipUserId);
        //     setLoginUserName(clipName);
        //     setLoginUserImage(clipImage);
        //     console.log(clipImage);
        // } else {
        fetchLoginUsersData();
        // }
    }, []);

    // 友達（相互フォロー）リストへ遷移
    const handleFriendList = async () => {
        const matchingIds = await getMatchingIds();
        const users = await getUseresData(matchingIds);
        
        // userが[]じゃなかったら、match: trueを追加する
        const updatedUsers = users.length > 0 ? users.map(user => ({ ...user, match: true })) : users;
        navigation.navigate('List', { user: updatedUsers });
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

    const onPickImage = async () => {
        const uri = await pickImage();
        if (!uri) {
            return;
        }
        const user = await getLoginUsersData();
        const beforeUri = user.imageUrl ? user.imageUrl : null;
        const imageurl = await imageStore(beforeUri, uri);
        // const data = await getLoginUsersData();
        // setLoginUsersData(data)
        dispatch(storeImage(imageurl));
        setLoginUserImage(imageurl);
    };

    const handleDelete = async () => {
        const data = await getLoginUsersData();
        navigation.navigate('Delete', { user: data });
    };

    const settingsData = [
        {
            title: "友達一覧",
            icon: "people-circle-outline",
            action: handleFriendList,
        },
        {
            title: "フォロー申請一覧",
            icon: "add-outline",
            action: handleFollowRequest,
        },
        {
            title: "名前検索",
            icon: "search-outline",
            // action: handleSearchName,
            action: () => navigation.navigate("NameSearch"),
        },
        {
            title: "５秒でわかる使い方",
            icon: "help-outline",
            action: () => navigation.navigate("Usage", { action: action }),
        },
        {
            title: "報告",
            icon: "information-outline",
            action: () => navigation.navigate("Form"),
        },
        {
            title: "アカウント削除",
            icon: "trash",
            action: handleDelete,
        },
    ];


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
                <View style={styles.qrCode}>
                    {loginUserId && <QRCode value={loginUserId} size={200} style={styles.qrCode} />}
                </View>
                <ButtunPrompt action="QR読み取り" onPress={() => navigation.navigate('QRCode')} />
            </View>


            <View style={styles.flatListContainer}>
            {settingsData.map((item, index) => (
            <SettingListItem
                key={index}
                title={item.title}
                icon={item.icon}
                onPress={item.action}
            />
        ))}
            </View>


        </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,

    },
    subContainer: {
        alignItems: 'center',
        marginBottom: 50,
        paddingTop: 100,
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
    qrCode: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    fliendContainer: {
        marginBottom: 36,
    },
    anatherContainer: {
        marginBottom: 10,
    },
    flatListContainer: {
        flexGrow: 1,
        paddingBottom: 20,
      },
});

