import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, FlatList, SafeAreaView, ScrollView, RefreshControl, View, ActivityIndicator, Text } from 'react-native';
import { ListItem } from "../components/ListItem";
import { db, getChatUsersData, getAllUsers, auth, getFollowedData } from '../lib/firebase'


export const ChatListScreen = ({ navigation }) => {
  const [usersData, setUsersData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  //初期化時:共有してるユーザを取得
  useEffect(() => {
    const fetchData = async () => {
        const uid = auth.currentUser.uid;
        const data = await getChatUsersData(uid);
        setUsersData(data);
        console.log(data)
      } 
    fetchData();
  }, []);

  const fetchData = async () => {
    const uid = auth.currentUser.uid;
    const data = await getChatUsersData(uid);
    setUsersData(data);
    console.log(data)
  } 

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // データの更新処理
      const uid = auth.currentUser.uid;
      const data = await getChatUsersData(uid);
      setUsersData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

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
            onPress={() => navigation.navigate('Chat', { user: item })}
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