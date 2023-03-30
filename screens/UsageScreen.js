import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { ButtunPrompt } from '../components/ButtunPrompt'

export const UsageScreen = ({route, navigation}) => {
  const { action } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>5秒でわかる使い方</Text>
      <View style={styles.listItem}>
        <Text style={styles.listTitle}>1. ボタンを押すと20分間相互フォロー者のみに位置が共有されます！（20分間たつと共有が終わります！）</Text>
        <Image
          source={require('../image/Sample.png')}
          style={styles.image}
        />
      </View>
      <View style={styles.listItem}>
        <Text style={styles.listTitle}>2. 誰かと飲みたいなと思った時に押そう！</Text>
      </View>
  
      {action === 'Home' && (
        <View>
          <ButtunPrompt
            action="ログイン"
            onPress={() => navigation.navigate('Login')}
          />
          <ButtunPrompt
            action="新規作成"
            onPress={() => navigation.navigate('Register')}
            style={styles.login}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16, // 左右のpadding
    paddingVertical: 24, // 上下のpadding
  },
  title: {
    fontSize: 32, // フォントサイズ
    fontWeight: 'bold', // 太字
    marginBottom: 24, // タイトルの下の余白
  },
  listItem: {
    marginBottom: 12, // リストのアイテムごとの余白
  },
  listTitle: {
    fontSize: 16, // フォントサイズ
    lineHeight: 24, // 行間
    textAlign: 'center', // 中央揃え
    fontWeight: 'bold', // 太字
  },
  image: {
    width: 300, // 画像の幅
    height: 300, // 画像の高さ
    resizeMode: 'contain', // 画像を縮小せずにフィット
    marginTop: 12, // 余白
    alignSelf: 'center', // 中央揃え
    // borderColor: '#FA9191',
    // borderWidth: 2, 
    // borderRadius: 32,
  }
});
