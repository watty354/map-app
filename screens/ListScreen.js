import { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { ListItem } from "../components/ListItem";
import { db, getChatUsersData, getAllUsers, auth, getFollowedData } from '../lib/firebase'


export const ListScreen = ({ route, navigation }) => {
  // console.log(Constants.manifest.extra.newsApiKey);
  
  const [usersData, setUsersData] = useState([]);
  const [isRequest, setIsRequest] = useState([false]);
  

  //初期化時:共有してるユーザを取得
  useEffect(() => {
    const fetchData = async () => {
      if (route.params?.route === 'chat') {
        const uid = auth.currentUser.uid;
        const data = await getChatUsersData(uid);
        setUsersData(data);
      } else {
        const data = await getAllUsers();
        setUsersData(data);
      }
      setIsRequest(true);
    };
    fetchData();
    console.log(route.params);
  }, [route]);

  return (
    <SafeAreaView style={styles.container}>
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
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    height: 100,
    width: "100%",
    flexDirection: "row",
  },
  leftContainer: {
    width: 100,
  },
  rightContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
  },
  subText: {
    fontSize: 12,
    color: "gray",
  }

});