import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Button, Image, TouchableOpacity, Text, AppState, Alert } from 'react-native';
import * as Location from 'expo-location';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db, getLoginUsersData, getUserData, auth, mapDisplay, mapDisplayNone, getMapFollowUsersData, getMatchingIds } from '../lib/firebase'
import { userLocation } from '../lib/location';
import { ButtunPrompt } from '../components/ButtunPrompt'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { async } from '@firebase/util';
import { useDispatch, useSelector } from 'react-redux';
import { storeUserId, storeImage, storeName } from '../store/userSlice';
// import BackgroundTask from 'react-native-background-task';

export const MapScreen = ({ route, navigation }) => {
  const [usersData, setUsersData] = useState([]);
  const [loginUsersData, setLoginUsersData] = useState([]);
  const [loginUserName, setLoginUserName] = useState("");
  const [loginUserImage, setLoginUserImage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const dispatch = useDispatch();
  const clipName = useSelector((state) => state.user.displayName);
  const clipImage = useSelector((state) => state.user.displayImage);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  //共有してるユーザを取得
  useEffect(() => {
    const fetchUsersData = async () => {
      const data = await getMapFollowUsersData();
      setUsersData(data);
    };
    fetchUsersData();
  }, []);

  //ログインしてるユーザを取得
  useEffect(() => {
    const fetchLoginUsersData = async () => {
      const data = await getLoginUsersData();
      console.log(data);
      setLoginUsersData(data);
      dispatch(storeName(data.displayName));
      dispatch(storeImage(data.imageUrl));
      setLoginUserName(data.displayName);
      setLoginUserImage(data.imageUrl);
    };
    if (clipName && clipImage) {
      setLoginUserName(clipName);
      setLoginUserImage(clipImage);
    } else {
      fetchLoginUsersData();
    }
  }, []);

  //リアルタイムDB取得のおまじない
  useEffect(() => {
    const fetchData = async () => {
      const matchingIds = await getMatchingIds();
      const unsubscribe = onSnapshot(
        query(collection(db, 'users'), where('displayMap', '==', true)),
        (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const matchingUsers = data.filter(user => matchingIds.includes(user.user_id));
          // console.log(matchingUsers);
          setUsersData(matchingUsers);
        }
      );
      return () => unsubscribe();
    };
    fetchData();
  }, []);


  //マップ初期表示
  const [mapRegion, setMapRegion] = useState({
    // 初期表示
    latitude: 34.665442,
    longitude: 135.516912,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markerVisible, setMarkerVisible] = useState(false);
  //現在地の表示
  const userLocationNow = async () => {
    // let location = userLocation();
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }
    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
  }
  useEffect(() => {
    userLocationNow();
  }, []);

  //共有ボタン押下アクション
  const handlePress = () => {
    if (markerVisible) {
      Alert.alert('停止', '位置が共有を停止しますか？', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: locationNowStop },
      ]);
    } else {
      Alert.alert('共有開始', '今から相互フォローの人に位置が共有されます', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: locationNowStart },
      ]);

    }

  }

  //位置共有開始
  locationNowStart = () => {
    if (!markerVisible) {
      setMarkerVisible(true);
      mapDisplay(mapRegion.latitude, mapRegion.longitude);
    }
  }

  //位置共有停止
  locationNowStop = () => {
    setMarkerVisible(false);
    mapDisplayNone();
  }

  // // アプリの状態を監視
  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState === 'active') {
      const data = await getLoginUsersData();
      if (data.mapDisplay === false) {
        setMarkerVisible(false);
        mapDisplayNone();
      }
    }
  }
  // AppStateのリスナーを登録
  AppState.addEventListener('change', handleAppStateChange);

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <><MapView style={styles.map}
          region={mapRegion}
          provider={PROVIDER_GOOGLE}
        >
          {markerVisible && (
            <Marker
              coordinate={{
                latitude: mapRegion.latitude,
                longitude: mapRegion.longitude,
              }}
            // title={loginUsersData[0].displayName}
            >
              {loginUserImage && loginUserName ? (
                <View style={styles.customMarker}>
                  <Text style={styles.markerTitle}>{loginUserName}</Text>
                  <Image source={{ uri: loginUserImage }} style={styles.markerImage} />
                </View>
              ) : (
                <View style={styles.customMarker}>
                <Text style={styles.markerTitle}>{loginUserName}</Text>
                <Image
                  source={require('../image/NoneImage.png')}
                  style={styles.markerImage} />
              </View>
              )}
            </Marker>
          )}
          {usersData.map((user) => (
            <Marker
              key={user.id}
              coordinate={{
                latitude: user.latitude,
                longitude: user.longitude,
              }}
              // title={user.displayname}
              // description={user.displayName}
              onPress={() => navigation.navigate('Chat', { user: user })}
            >
              <View style={styles.customMarker}>
                <Text style={styles.markerTitle}>{user.displayName}</Text>
                {user?.imageUrl ? (
                  <Image source={{ uri: user.imageUrl }} style={styles.markerImage} />
                ) : (

                  <Image source={require('../image/NoneImage.png')} style={styles.markerImage} />
                )}
                {/* <Image
                  source={{ uri: user.imageUrl }}
                  style={styles.markerImage} /> */}
              </View>
            </Marker>
          ))}
        </MapView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonContainer} onPress={handlePress}>
              <View style={[styles.button, { backgroundColor: markerVisible ? '#BDBDBD' : '#EB6383' }]}>
                <Text style={styles.buttonText}>{markerVisible ? '停止' : 'ここおるで〜'}</Text>
                <Ionicons name={[markerVisible ? "stop-circle-outline" : "beer-outline"]} size={70} style={styles.icon} />
              </View>
            </TouchableOpacity>
          </View></>
      ) : (
        <View>
          <ButtunPrompt
            action="ログイン"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  markerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#EB6383',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#EB6383',
    padding: 24,
    height: 150,
    width: 150,
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  icon: {
    color: '#fff',
    textAlign: 'center',
  },
  customMarker: {
    alignItems: 'center',
    // backgroundColor: '#eee',
    borderRadius: 8,
    padding: 8,
  },
  markerIcon: {
    height: 32,
    width: 32,
  },
  markerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
    color: "#EB6383"
  },
});