import { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import { db, getLoginUsersData, getSearchName, auth, imageStore, getFollowedData, getUseresData, getMatchingIds, getFolloweredUsersData, getFollowedId } from '../lib/firebase'
import { pickImage } from '../lib/image-picker'
import { ButtunPrompt } from '../components/ButtunPrompt'
import QRCode from 'react-native-qrcode-svg';

export const AccuntScreen = ({ navigation }) => {
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

    if(loginUsersData.length > 0 && !loginUsersData[0].imageUrl){
        Alert.alert('写真を設定して下さい');
      }

    // 友達（相互フォロー）リストへ遷移
    const handleFrienfList = async() => {
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
    if (!loginUsersData) {
        navigation.navigate('Home');
    }

    const onPickImage = async () => {
        const uri = await pickImage();
        if (!uri) {
            return;
        }
        const beforeUri = loginUsersData[0]?.imageUrl ? loginUsersData[0].imageUrl : null;
        await imageStore(beforeUri, uri);
        const data = await getLoginUsersData();
        setLoginUsersData(data)

    };

    return (
        <ScrollView>

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
            {/* <QRCodeGenerator userId={uid} /> */}
            <View style={styles.qrCode}>

            <QRCode value={loginUsersData[0]?.user_id?.toString()} size={200} style={styles.qrCode}/>
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
                    onPress={() => navigation.navigate('Usage', {action : action})}
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

