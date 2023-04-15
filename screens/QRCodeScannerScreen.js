import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
// import { getUserData } from '../api/user';
import { db, getUserData, getSearchName, auth, imageStore, getFollowedData } from '../lib/firebase'
import UserScreen from './UserScreen';

export const QRCodeScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    const action = "QRcode"
    // QRコードからuserIdを取得
    const userId = data;
    // userIdをもとにユーザ情報を取得
    const userData = await getUserData(userId);
    navigation.navigate('User', { user: userData, action: action})
    // setUserData(userData);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && userData && (
        <UserScreen userData={userData} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
