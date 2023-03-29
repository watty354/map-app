import { useState, useEffect } from 'react';
import { onAuthStateChanged, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { db, getLoginUsersData, getSearchName, auth, imageStore, getFollowedData } from '../lib/firebase'
import { pickImage } from '../lib/image-picker'
import { ButtunPrompt } from '../components/ButtunPrompt'

export const AccuntScreen = ({ navigation }) => {
    const [userId, setUserId] = useState('');
    const [isFollowRequested, setIsFollowRequested] = useState(false);
    const [loginUsersData, setLoginUsersData] = useState([]);
    const [userName, setName] = useState('');

    //ログインしてるユーザを取得
    useEffect(() => {
        const fetchLoginUsersData = async () => {
            const data = await getLoginUsersData();
            setLoginUsersData(data)
        };
        fetchLoginUsersData();
    }, []);

    // ユーザーIDの変更時に呼ばれるハンドラー
    const handleUserIdChange = (event) => {
        setUserId(event.target.value);
    };

    // フォロー申請画面に遷移するハンドラー
    const handleFollowRequest = async () => {
        const user = await getFollowedData();
        console.log(user);
        navigation.navigate('List', { user: user });
    };

    //名前検索
    const handleSearchName = async () => {
        const user = await getSearchName(userName);
        navigation.navigate('List', { user: user });
    }

    // ログインしていない場合はログインページにリダイレクト
    if (!loginUsersData) {
        navigation.navigate('Home');
    }

    const onPickImage = async () => {
        const uri = await pickImage();
        const beforeUri = loginUsersData[0]?.imageUrl ? loginUsersData[0].imageUrl : null;
        await imageStore(beforeUri, uri);
        const data = await getLoginUsersData();
        setLoginUsersData(data)

    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPickImage}>
                {loginUsersData[0]?.imageUrl ? (
                    <Image source={{ uri: loginUsersData[0].imageUrl }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarPlaceholderText}>写真を選択</Text>
                    </View>
                )}
            </TouchableOpacity>
            <Text style={styles.name}>{loginUsersData[0]?.displayName}</Text>


            <TextInput
                value={userName}
                onChangeText={(value) => setName(value)}
                style={{ marginVertical: 5, width: '80%', padding: 10, borderWidth: 1, borderRadius: 5 }}
            />

            <ButtunPrompt
                action="ID検索"
                onPress={handleSearchName}
            />

            <ButtunPrompt
                action="フォロー申請一覧"
                onPress={handleFollowRequest}
            />
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
        marginTop: 24,
        fontSize: 16,
        fontWeight: '600',
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
});

