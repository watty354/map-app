import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator, Image, TouchableOpacity, Text, AppState, Alert, Modal } from 'react-native';
import * as Location from 'expo-location';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db, getLoginUsersData, getUserData, auth, mapDisplay, mapDisplayNone, getMapFollowUsersData, getMatchingIds } from '../lib/firebase'
import { userLocation } from '../lib/location';
import { ButtunPrompt } from '../components/ButtunPrompt'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { async } from '@firebase/util';
import { useDispatch, useSelector } from 'react-redux';
import { storeUserId, storeImage, storeName, storeDisplayMap, storeCountry } from '../store/userSlice';
import { PrefecturePicker, getPrefectureLatLng } from '../components/PrefecturePicker'

export const MapScreen = ({ route, navigation }) => {
  const [usersData, setUsersData] = useState([]);
  const [loginUsersData, setLoginUsersData] = useState([]);
  const [loginUserName, setLoginUserName] = useState("");
  const [loginUserImage, setLoginUserImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [locationCheck, setLocationCheck] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPrefecture, setSelectedPrefecture] = useState(null);

  const dispatch = useDispatch();
  const clipName = useSelector((state) => state.user.displayName);
  const clipImage = useSelector((state) => state.user.displayImage);
  const clipMap = useSelector((state) => state.user.displayMap);
  const clipCountry = useSelector((state) => state.user.country);

  //共有してるユーザを取得
  useEffect(() => {
    const fetchUsersData = async () => {
      const data = await getMapFollowUsersData();
      setUsersData(data);
    };
    fetchUsersData();
  }, []);

  // マップの表示
  useEffect(() => {
    const displayMapStatus = async () => {
      if (clipMap) {
        setMarkerVisible(clipMap);
      }
    };
    displayMapStatus();
  }, []);

  // 初期表示設定モーダル表示
  useEffect(() => {
    const getPrefecture = async () => {
      if (clipCountry) {
        const location = getPrefectureLatLng(clipCountry);
        setMapRegion({
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        })
      } else {
        handleOptionsPress();
      }
    };
    getPrefecture();
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
      if (matchingIds.length === 0) {
        return;
      }
      const unsubscribe = onSnapshot(
        query(collection(db, 'users'), where('displayMap', '==', true), where('user_id', 'in', matchingIds),),
        (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const matchingUsers = data.filter(user => matchingIds.includes(user.user_id));
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

  const [nowMapRegion, setNowMapRegion] = useState({});
  const [markerVisible, setMarkerVisible] = useState(false);
  //現在地の表示 - (位置表示)
  const userLocationNow = async (action) => {
    setIsFetchingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setIsFetchingLocation(false);
      Alert.alert('位置情報の許可が必要です', '位置情報の許可をしてください');
      return Promise.resolve(false);
    }
    setLocationCheck(true);
    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
    if (action == "start") {
      setNowMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
    }
    setIsFetchingLocation(false);
    return Promise.resolve(true);
  }

  //共有ボタン押下アクション
  const handlePress = () => {
    if (markerVisible) {
      Alert.alert('停止', '位置が共有を停止しますか？', [
        {
          text: 'キャンセル',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: locationNowStop },
      ]);
    } else {
      Alert.alert('共有開始', '今から相互フォローの人に位置が共有されます', [
        {
          text: 'キャンセル',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: locationNowStart },
      ]);
    }
  }

  //位置共有開始
  locationNowStart = async () => {
    setIsLoading(true);
    dispatch(storeDisplayMap(true));
    if (!markerVisible) {
      const action = "start";
      const status = userLocationNow(action);
      if (status) {
        setMarkerVisible(true);
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (nowMapRegion.latitude && nowMapRegion.longitude) {
      mapDisplay(nowMapRegion.latitude, nowMapRegion.longitude);
    }
  }, [nowMapRegion]);


  //位置共有停止
  locationNowStop = () => {
    setMarkerVisible(false);
    mapDisplayNone();
    dispatch(storeDisplayMap(false));
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

  const handleReflesh = async () => {
    setIsLoading(true);
    const action = "reflesh";
    userLocationNow(action);
    const data = await getMapFollowUsersData();
    setUsersData(data);
    setIsLoading(false);
  }

  // 初期表示設定 
  const handleOptionsPress = () => {
    setModalVisible(!modalVisible);
  };
  const handleSelectedPrefecture = () => {
    dispatch(storeCountry(selectedPrefecture));
    const location = getPrefectureLatLng(selectedPrefecture);
    setMapRegion({
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
    setModalVisible(!modalVisible);
  }

  return (
    <View style={styles.container}>

      {
      //現在地取得画面
        isFetchingLocation && (
          <Modal transparent={true} statusBarTranslucent={true}>
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={{ color: '#FFF' }}>現在地を取得しています</Text>
            </View>
          </Modal>
        )}
      <><><MapView style={styles.map}
        region={mapRegion}
      //provider={PROVIDER_GOOGLE}
      >
        {markerVisible && (
          <Marker
            coordinate={{
              latitude: mapRegion.latitude,
              longitude: mapRegion.longitude,
            }}
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
          user.displayMap && (
            <Marker
              key={user.id}
              coordinate={{
                latitude: user.latitude,
                longitude: user.longitude,
              }}
              onPress={() => navigation.navigate('ChatTab', { screen: 'Chat', params: { user: user } })}
            >
              <View style={styles.customMarker}>
                <Text style={styles.markerTitle}>{user.displayName}</Text>
                {user?.imageUrl ? (
                  <Image source={{ uri: user.imageUrl }} style={styles.markerImage} />
                ) : (
                  <Image source={require('../image/NoneImage.png')} style={styles.markerImage} />
                )}
              </View>
            </Marker>
          )
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

        <View style={styles.topLeftButtonContainer}>
          <TouchableOpacity onPress={handleReflesh}>
            <View style={styles.topLeftButton}>
              <Ionicons name="refresh-outline" style={styles.topLeftButtonlogo} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleOptionsPress}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={[styles.modalText, { color: 'black' }]}>都道府県を選択してください</Text>
                <PrefecturePicker
                  selectedPrefecture={selectedPrefecture}
                  onValueChange={(itemValue) => setSelectedPrefecture(itemValue)}
                />
                <TouchableOpacity style={styles.modalButton} onPress={handleSelectedPrefecture}>
                  <Text style={[styles.modalText]}>決定</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleOptionsPress}>
                  <Text style={[styles.modalText, { color: 'black' }]}>今は決めない！</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        {isLoading && (
          //リフレッシュ画面
          <Modal transparent={true} statusBarTranslucent={true}>
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          </Modal>
        )}
      </>
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
  topLeftButtonContainer: {
    position: 'absolute',
    top: 80,
    left: 25,
  },
  topLeftButton: {
    backgroundColor: '#BDBDBD',
    padding: 10,
    borderRadius: 100,
  },
  topLeftButtonlogo: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 40,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    // margin: 20,
    marginBottom: 50,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    color: 'red'
  },
  modalButton: {
    marginTop: 10,
  },
});