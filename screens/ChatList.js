import React, { useState, useEffect } from 'react';
import { setStatusBarTranslucent, StatusBar } from 'expo-status-bar';
import { StyleSheet, FlatList, SafeAreaView, ScrollView, RefreshControl, View, ActivityIndicator, Text } from 'react-native';
import { ListItem } from "../components/ListItem";
import { db, getChatUsersData, getAllUsers, auth, getFollowedData, getSendUsersData } from '../lib/firebase'
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { ButtunPrompt } from '../components/ButtunPrompt'
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';

export const ChatListScreen = ({ navigation }) => {
  const [usersData, setUsersData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const blockUsers = useSelector((state) => state.user.blockUsers);

    // 共有しているユーザーを取得して、ブロックしたユーザーを除外する
    const getFilteredUsers = (allUsers) => {
      const blockUsers = blockUsers || [];
      return allUsers.filter((user) => !blockUsers.includes(user.user_id));
    };

  //初期化時:共有してるユーザを取得
  useEffect(() => {
    const fetchData = async () => {
        const uid = auth.currentUser.uid;
        const data = await getChatUsersData(uid);
        const filteredUsers = getFilteredUsers(data);
        setUsersData(filteredUsers);
      } 
      if(isFocused) {
        fetchData();
      }
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // データの更新処理
      const uid = auth.currentUser.uid;
      const data = await getChatUsersData(uid);
      // newSendcheck();
      setUsersData(data);
    } catch (error) {
      console.error(error);
    } finally {
      newSendcheck();
      setRefreshing(false);
    }
  };

  //バッジ実装
  useEffect(() => {
    if (isFocused) {
      newSendcheck();
    }
  }, [isFocused]);

    const handleChat = (item) => {
      const updatedUsersData = usersData.map((user) => {
        if (user.user_id === item.user_id) {
          return {
            ...user,
            isNewMessage: false,
          };
        }
        return user;
      });
      setUsersData(updatedUsersData);
      navigation.navigate('Chat', { user: item });
    };


    const newSendcheck = async () => {
      const uid = auth.currentUser.uid;
      const data = await getSendUsersData(uid);
      const updatedUsersData = usersData.map((user) => {
        if (data.includes(user.user_id)) {
          return {
            ...user,
            isNewMessage: true,
          };
        }
        return user;
      });
      setUsersData(updatedUsersData);
    } 

  return (
<SafeAreaView style={styles.container}>
  {usersData.length !== 0 ? (
    <>
      <FlatList
        data={usersData}
        renderItem={({ item }) => (
          <ListItem
            imageUrl={item.imageUrl}
            displayName={item.displayName}
            // onPress={() => navigation.navigate('Chat', { user: item })}
            onPress={() => handleChat(item)}
            badge={item.isNewMessage || false}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      {refreshing && (
        <View style={styles.refreshIndicator}>
          <ActivityIndicator />
        </View>
      )}
      <StatusBar style="auto" />
    </>

  ) : (
    <View style={styles.noUsersContainer}>
      <Text style={styles.noUsersText}>トーク履歴なし</Text>
      {refreshing && (
        <View style={styles.refreshIndicator}>
          <ActivityIndicator />
        </View>
      )}
    </View>
    
  )}
</SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  refreshIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  noUsersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noUsersText: {
    fontSize: 18,
    color: '#555',
  },
});