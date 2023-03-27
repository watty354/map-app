import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { db, auth } from '../lib/firebase'
import { doc, setDoc, collection, addDoc, Timestamp} from "firebase/firestore";

export const UserScreen = ({ route }) => {
    const { user } = route.params;

    // フォロー申請画面に遷移するハンドラー
    const handleFollow = async() => {
        const uid = auth.currentUser.uid;
        //フォローTBL登録
        const data = {
            follower_id: uid,
            followed_id: user.user_id,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        }
        await setDoc(doc(db, "follow", uid), data);
        // const docRef = addDoc(collection(db, "follow"), {
        //     follower_id: uid,
        //     followed_id: user.user_id,
        //     createdAt: Timestamp.now(),
        //     updatedAt: Timestamp.now(),
        // })
        // .then((docRef) => {
        //     console.log('Register Success:');
        // })
        // .catch((error) => {
        //     console.error("Error adding document: ");
        // });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
            </TouchableOpacity>
            <Text style={styles.name}>{user.displayName}</Text>

            <TouchableOpacity style={styles.followButton} onPress={handleFollow} >
                <Text style={styles.loginButtonText}>フォローする</Text>
            </TouchableOpacity>
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
