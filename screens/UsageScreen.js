import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { ButtunPrompt } from '../components/ButtunPrompt'

export const UsageScreen = ({ route, navigation }) => {
  const { action } = route.params;
  return (
    // <ScrollView>
    <View style={styles.container}>
      <Image source={require('../image/logo.png')} style={styles.logo} />
      <View style={styles.listItem}>
        <Text style={styles.listTitle}>1. ボタンを押すと相互フォロー者のみに位置が<Text style={styles.pri}>共有</Text>されます</Text>
        <Text style={styles.subText}>※追跡ではありません。ボタンを押したその時点の場所が表示されます</Text>
        {/* <Text style={styles.listTitle}>位置が共有されます！</Text> */}
        <Text style={styles.listTitle}>2. 停止ボタンを押すと位置共有が停止されます！</Text>
        <Text style={styles.subText}>（押し忘れても午前６時に自動で停止されます）</Text>
        <View style={styles.row}>
          <Image source={require('../image/Sample.png')} style={styles.image} />
          <Image source={require('../image/Sample2.png')} style={styles.image} />
        </View>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.subTitle}>誰かと飲みたいなと思った時に押そう！</Text>
      </View>

      {action === 'Home' && (
        <View>
          {/* <ButtunPrompt
            action="ログイン"
            onPress={() => navigation.navigate('Login')}
          /> */}
          <ButtunPrompt
            action="新規作成"
            onPress={() => navigation.navigate('Register')}
            style={styles.login}
          />
        </View>
      )}
          <View style={styles.devItem}>
            <Text style={styles.text}>開発者追記</Text>
            <Text style={styles.devText}>改善点や使う人が多くなればアプデしていきますので、様々なご意見お待ちしています。</Text>
          </View>
    </View>
    // </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: 16, // 左右のpadding
    // paddingVertical: 16, // 上下のpadding
  },
  title: {
    width: '100%',
    fontSize: 32, // フォントサイズ
    fontWeight: 'bold', // 太字
    marginBottom: 24, // タイトルの下の余白
    color: '#fff',
    backgroundColor: '#EB6383',
    textAlign: 'center', // 中央揃え
    paddingVertical: 16, // 上下のpadding
  },
  listItem: {
    marginBottom: 12, // リストのアイテムごとの余白
  },
  listTitle: {
    fontSize: 16, // フォントサイズ
    lineHeight: 24, // 行間
    textAlign: 'left', // 中央揃え
    fontWeight: 'bold', // 太字
  },
  subTitle: {
    fontSize: 16, // フォントサイズ
    lineHeight: 24, // 行間
    textAlign: 'center', // 中央揃え
    fontWeight: 'bold', // 太字
  },
  image: {
    width: 150, // 画像の幅
    height: 200, // 画像の高さ
    // resizeMode: 'contain', // 画像を縮小せずにフィット
    marginTop: 12, // 余白
    // alignSelf: 'center', // 中央揃え
    borderColor: '#FA9191',
    borderWidth: 2, 
    borderRadius: 32,
    marginHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  devText: {
    fontSize: 16, // フォントサイズ
    lineHeight: 24, // 行間
    textAlign: 'left', // 中央揃え
    fontWeight: 'bold', // 太字
  },
  devItem: {
    paddingHorizontal: 16, // 左右のpadding
    paddingVertical: 24, // 上下のpadding
    bottom:24,
  },
  pri: {
    color: '#EB6383'
  },
  logo: {
    width: 300, // 画像の幅
    height: 70,
    resizeMode: 'contain', // 画像を縮小せずにフィット
    marginBottom: 10
  },
  subText: {
    fontSize: 12, // フォントサイズ
    marginBottom: 10
  }
});
