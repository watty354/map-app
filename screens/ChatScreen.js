import React, { useState, useEffect } from 'react'
import { Bubble, GiftedChat, Send, Avatar } from 'react-native-gifted-chat';
import { doc, collection, onSnapshot, arrayUnion, query, orderBy, setDoc, getDoc, addDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getUserData, blockUserData } from '../lib/firebase';
import { db, auth } from '../lib/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { storeImage, storeBlockUsers} from '../store/userSlice';


export const ChatScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const [messages, setMessages] = useState([]);
  const [loginUser, setLoginUser] = useState([]);
  const [loginUserImage, setLoginUserImage] = useState("");
  const chatId = getChatId(user.user_id, auth.currentUser.uid);
  const chatDocRef = doc(db, 'chats', chatId);

  const dispatch = useDispatch();
  const clipImage = useSelector((state) => state.user.displayImage);

  // オプション
  const [modalVisible, setModalVisible] = useState(false);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleOptionsPress}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" style={{ marginRight: 10 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // キャンセル処理
  const handleOptionsPress = () => {
    setModalVisible(!modalVisible);
  };

  // ブロック処理
  const handleBlock = () => {
    Alert.alert('ブロック', '本当にブロックしますか？もう二度とフォローすることができなくなります', [
      {
        text: 'キャンセル',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: blockUser },
    ]);
  };
  //ユーザーブロック処理
  const blockUser = async () => {
    const chatId = getChatId(user.user_id, auth.currentUser.uid);
    await blockUserData(user.user_id, chatId);
    dispatch(storeBlockUsers(user.user_id));
    navigation.goBack(); 
  };

  // 報告処理を記述
  const handleReport = () => {
    Alert.alert('報告', '報告するとこのユーザーは検討後削除される可能性があります。本当に報告しますか？', [
      {
        text: 'キャンセル',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: ReportUser },
    ]);
  };
  //報告フォームへ遷移
  const ReportUser = async () => {
    navigation.navigate("Form", { reportUserName: user }),
      handleOptionsPress();
  };

  useEffect(() => {
    async function fetchData() {
      const userData = await getUserData(auth.currentUser.uid);
      setLoginUser(userData);
      dispatch(storeImage(userData.imageUrl));
    }
    if (clipImage) {
      setLoginUserImage(clipImage);
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(chatDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const messagesRef = collection(chatDocRef, 'messages');
        const messagesUnsubscribe = onSnapshot(
          query(messagesRef, orderBy('createdAt', 'desc')),
          (querySnapshot) => {
            const messages = [];
            querySnapshot.forEach((doc) => {
              messages.push({
                ...doc.data(),
                createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
                _id: doc.id,
                // user: {
                //   avatar: doc.imageUrl,
                //   // _id: user.user_id,
                // },
              });
            });
            setMessages(messages);
          }
        );
        return () => messagesUnsubscribe();
      } else {
        setMessages([]);
        return () => { };
      }
    });

    return () => unsubscribe();
  }, []);




  const onSend = async (messages) => {

    const chatDoc = await getDoc(chatDocRef);
    if (!chatDoc.exists()) {
      await setDoc(chatDocRef, {});
    }
    data = {
      talkId: arrayUnion(auth.currentUser.uid),
      senderId: auth.currentUser.uid,
      receiverId: user.user_id
    }
    await updateDoc(doc(db, "chats", chatId), data);

    messages.map((message) => {
      // if (!message.createdAt) {
      //   message.createdAt = Timestamp.now();
      // }
      return addDoc(collection(chatDocRef, 'messages'), {
        ...message,
        // createdAt: Timestamp.now(),
        senderId: auth.currentUser.uid,
        receiverId: user.user_id,
      });
    });

    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  };





  const renderBubble = (props) => {
    return (
      <Bubble {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#EB6383',
          },
          left: {
            backgroundColor: '#FFF',
          }
        }}
      />
    );
  }
  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <Ionicons
            name="send-outline"
            size={32} color='#EB6383'
            style={{ marginBottom: 5, marginRight: 5 }} />
        </View>
      </Send>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        placeholder='メッセージを入力'
        alwaysShowSend
        renderSend={renderSend}
        onSend={messages => onSend(messages)}
        user={{
          _id: auth.currentUser.uid,
          avatar: loginUserImage
        }}
        renderBubble={renderBubble}
        // renderAvatar={false} 
        showAvatarForEveryMessage={true}
        bottomOffset={Platform.OS === 'ios' ? 64 : 0}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleOptionsPress}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.modalButton} onPress={handleBlock}>
              <Text style={styles.modalText}>ブロックする</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={handleReport}>
              <Text style={styles.modalText}>報告する</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={handleOptionsPress}>
              <Text style={[styles.modalText, { color: 'black' }]}>キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
};

const getChatId = (userId, otherUserId) => {
  if (userId < otherUserId) {
    return `${userId}-${otherUserId}`;
  } else {
    return `${otherUserId}-${userId}`;
  }
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    marginTop: 15,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    color: 'red'
  },
});