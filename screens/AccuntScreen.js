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
    const action = "Accunt";

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
            <View style={styles.subContainer}>
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
            </View>


            <View style={styles.idContainer}>
            <TextInput
                value={userName}
                onChangeText={(value) => setName(value)}
                style={styles.input}
            />
            <ButtunPrompt
                action="ID検索"
                onPress={handleSearchName}
            />
             </View>


            <ButtunPrompt
                action="フォロー申請一覧"
                onPress={handleFollowRequest}
            />

            <View style={styles.anatherContainer}>
                <ButtunPrompt
                    action="５秒でわかる使い方"
                    onPress={() => navigation.navigate('Usage', {action : action})}
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
        paddingHorizontal: 20,
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
});

