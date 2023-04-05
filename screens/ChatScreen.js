import React, { useState, useEffect } from 'react'
import { Bubble, GiftedChat, Send, Avatar } from 'react-native-gifted-chat';
import { doc, collection, onSnapshot, arrayUnion, query, orderBy, setDoc, getDoc, addDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { View, } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getUserData } from '../lib/firebase';
import { db, auth } from '../lib/firebase';

export const ChatScreen = ({ route }) => {
  const { user } = route.params;
  const [messages, setMessages] = useState([]);
  const [loginUser, setLoginUser] = useState([]);
  const chatId = getChatId(user.user_id, auth.currentUser.uid);
  const chatDocRef = doc(db, 'chats', chatId);

  useEffect(() => {
    async function fetchData() {
      const userData = await getUserData(auth.currentUser.uid);
      setLoginUser(userData);
    }
    fetchData();
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
        style={{marginBottom:5, marginRight: 5}}/>
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
          avatar: loginUser.imageUrl
        }}
        renderBubble={renderBubble}
        // renderAvatar={false} 
        showAvatarForEveryMessage={true}
      />
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
