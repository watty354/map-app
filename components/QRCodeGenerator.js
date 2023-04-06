import React, { useState , useEffect} from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export const QRCodeGenerator = ({ userId }) => {
  const [qrcode, setQRCode] = useState('');

  // QRコード生成処理
  function generateQRCode(data) {
    setQRCode(data);
  }

  // コンポーネントマウント時にQRコードを生成する
  useEffect(() => {
    generateQRCode(userId);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <QRCode value={qrcode} size={200} />
      <Text style={{ marginTop: 10 }}>Scan this QR code to get user ID</Text>
    </View>
  );
}
