import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
// import QRCodeScanner from 'react-native-qrcode-scanner';

export const QRCodeScannerScreen = () => {
  const [scannedData, setScannedData] = useState('');

  useEffect(() => {
    if (scannedData !== '') {
      // QRコードから読み取ったデータを使用して何らかの処理を行う
      Alert.alert('QRコード', `読み取ったデータ: ${scannedData}`);
    }
  }, [scannedData]);

  const handleQRCodeScanned = (data) => {
    setScannedData(data.data);
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={handleQRCodeScanned}
        containerStyle={styles.cameraContainer}
        cameraStyle={styles.camera}
        showMarker={true}
        markerStyle={styles.marker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  camera: {
    flex: 1,
  },
  marker: {
    borderWidth: 2,
    borderColor: 'white',
  },
});
