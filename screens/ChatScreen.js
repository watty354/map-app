import React, { useState, useEffect } from 'react'
import { Bubble, GiftedChat} from 'react-native-gifted-chat';
import { doc, collection, onSnapshot, arrayUnion, query, orderBy, setDoc, getDoc, addDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { View, } from 'react-native';


import { db, auth } from '../lib/firebase';
import { async } from '@firebase/util';

export const ChatScreen = ({ route }) => {
  const { user } = route.params;
  const [messages, setMessages] = useState([]);
  const chatId = getChatId(user.user_id, auth.currentUser.uid);
  const chatDocRef = doc(db, 'chats', chatId);

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
                //   name: user.disdisplayName,
                  // avatar: user.imageUrl,
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

    const promises = messages.map((message) => {
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


// ヘッダー試行錯誤
  // const renderChatHeader = () => {
  //   const name = user.displayName;
  //   return (
  //     <View style={{ backgroundColor: '#fff', paddingVertical: 10 }}>
  //       <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{name}</Text>
  //     </View>
  //   );
  // };

  // const renderInputToolbar = (props) => (
  //   <InputToolbar {...props} containerStyle={{ backgroundColor: '#fff' }}>
  //     <View style={{ backgroundColor: '#fff', paddingVertical: 10 }}>
  //       <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{user.displayName}</Text>
  //     </View>
  //   </InputToolbar>
  // );


  return (
<View style={{ flex: 1 }}>
  <GiftedChat
    messages={messages}
    onSend={messages => onSend(messages)}
    user={{
      _id: auth.currentUser.uid,
    }}
    renderBubble={props => {
      return (
        <Bubble {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#EB6383',
            },
          }}
        />
      );
    }}
    // renderInputToolbar={renderInputToolbar}
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
