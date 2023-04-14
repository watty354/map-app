import { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, FlatList, SafeAreaView, ScrollView, RefreshControl, View, Text } from 'react-native';
import { ListItem } from "../components/ListItem";
import { db, getChatUsersData, getAllUsers, auth, getFollowedData } from '../lib/firebase'
import { useDispatch, useSelector } from 'react-redux';
import { storeBlockUsers } from '../store/userSlice';


export const ListScreen = ({ route, navigation }) => {
  const [usersData, setUsersData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [blockUser, setBlockUser] = useState([]);

  const { user } = route.params;
  const blockUsers = useSelector((state) => state.user.blockUsers);

  // 共有しているユーザーを取得して、ブロックしたユーザーを除外する
  const getFilteredUsers = (allUsers) => {
    return allUsers.filter((user) => !blockUsers.includes(user.user_id));
  };

  //初期化時:共有してるユーザを取得
  useEffect(() => {
    const filteredUsers = getFilteredUsers(user);
    setUsersData(filteredUsers);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // データの更新処理
      setUsersData(usersData);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {usersData.length !== 0 ? (
        <FlatList
          data={usersData}
          renderItem={({ item }) => (
            <ListItem
              imageUrl={item.imageUrl}
              displayName={item.displayName}
              onPress={() => navigation.navigate('User', { user: item })}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <View style={styles.noUsersContainer}>
          <Text style={styles.noUsersText}>ユーザーが見つかりませんでした。</Text>
        </View>
      )}
      {refreshing && (
        <View style={styles.refreshIndicator}>
          <ActivityIndicator />
        </View>
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  refreshIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },

});