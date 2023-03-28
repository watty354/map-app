import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Button, Image, TouchableOpacity, Text , AppState} from 'react-native';
import * as Location from 'expo-location';
import { collection, query, where, getDocs , onSnapshot} from 'firebase/firestore';
import { db, getLoginUsersData, getMapUsersData, auth, mapDisplay ,mapDisplayNone, getMapFollowUsersData, getMatchingIds } from '../lib/firebase'
import { userLocation } from '../lib/location';
import { LoginPrompt } from '../components/LoginPrompt'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const MapScreen = ({ route, navigation }) => {
  const [usersData, setUsersData] = useState([]);
  const [loginUsersData, setLoginUsersData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      setLoginUsersData(data);
    };
    fetchLoginUsersData();
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
          console.log(matchingUsers)
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
  const markerTimer = useRef(null);

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
    // fetchLoginUsersData();
    if (!markerVisible) {
      setMarkerVisible(true);
      mapDisplay(mapRegion.latitude, mapRegion.longitude);
      if (markerTimer.current) {
        clearTimeout(markerTimer.current);
      }
      markerTimer.current = setTimeout(() => {
        setMarkerVisible(false);
        mapDisplayNone();
      }, 10000);
    }
  }
  // アプリの状態を監視
const handleAppStateChange = (nextAppState) => {
  if (nextAppState === 'active') {
    // アプリがフォアグラウンドに移行したときの処理
    mapDisplayNone();
  } else if (nextAppState === 'background') {
    // アプリがバックグラウンドに移行したときの処理
    mapDisplayNone();
  }
}

// AppStateのリスナーを登録
// const timerId = startTimer(); // 最初にタイマーをスタート
AppState.addEventListener('change', handleAppStateChange);

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  
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
              title={loginUsersData[0].displayName}
            >
              {loginUsersData[0]?.imageUrl ? (
                <Image
                  source={{ uri: loginUsersData[0].imageUrl }}
                  style={styles.markerImage} />
              ):(
                <Image
                source={require('../image/NoneImage.png')}
                style={styles.markerImage} />
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
              description={user.displayname}
            >
              <Image
                source={{ uri: user.imageUrl }}
                style={styles.markerImage} />
            </Marker>
          ))}
        </MapView><View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonContainer} onPress={handlePress}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>ここおるで〜</Text>
              </View>
            </TouchableOpacity>
          </View></>
      ) : (
        <View>
        <LoginPrompt onPress={handleLoginPress} />
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
    borderColor: 'red',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#EB6383',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});