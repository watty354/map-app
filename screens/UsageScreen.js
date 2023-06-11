import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { ButtunPrompt } from '../components/ButtunPrompt'

export const UsageScreen = ({ route, navigation }) => {
  const { action } = route.params;
  return (
    <ScrollView>
    <View style={styles.container}>
      <Image source={require('../image/logo.png')} style={styles.logo} />
      <View style={styles.listItem}>
        <Text style={styles.textTitle}>nominauについて</Text>
        <View style={styles.hr} />
        <Text style={styles.qustion}>nominau（ノミナウ）はどんなアプリですか？</Text>
        <Text style={styles.answer}>ボタンを押下したらフレンドだけに位置が<Text style={styles.pri}>共有</Text>されるアプリです。
        前もって予定を作るのが苦手なのと呑んでる時に気軽に誰かと合流できないかなと思い作りました。</Text>

        <Text style={styles.qustion}>どうやって使うんですか？</Text>
        <Text style={styles.answer}>ボタンを押したその時点の場所が表示されます。位置共有停止したい時はもう一度ボタンを押しましょう！</Text>

        <Text style={styles.qustion}>みんなに位置が共有されるの？</Text>
        <Text style={styles.answer}>相互フォローにのみ表示されます。</Text>

        <Text style={styles.qustion}>ボタン停止しないとずっと位置が表示されるの？</Text>
        <Text style={styles.answer}>毎日午前６時に非表示になるようにしてます。あと追跡するわけではなく
        ボタンを押したその時点での場所が表示されるだけなのでご安心を！</Text>

        <Text style={styles.qustion}>使うタイミングは？</Text>
        <Text style={styles.answerlist}>・気軽に誰かと合流したい時</Text>
        <Text style={styles.answerlist}>・近くで誰か呑んでる友達がいないか知りたい時</Text>

        <View style={styles.row}>
          <Image source={require('../image/Sample.png')} style={styles.image} />
          <Image source={require('../image/Sample2.png')} style={styles.image} />
        </View>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.subTitle}>誰かと飲みたいなと思った時に押そう！</Text>
      </View>

      {action === 'Home' && (
        <View style={styles.newCreate}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16, // 左右のpadding
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
  textTitle: {
    fontSize: 24, // フォントサイズ
    fontWeight: 'bold', // 太字
    color: '#4d5156',
    marginBottom: 8
  },
  subTitle: {
    fontSize: 20, // フォントサイズ
    lineHeight: 24, // 行間
    textAlign: 'center', // 中央揃え
    fontWeight: 'bold', // 太字
    color: '#EB6383',
    marginTop: 10
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
  listItem: {
    marginBottom: 12, // リストのアイテムごとの余白
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
    color: '#4d5156'
  },
  devItem: {
    paddingHorizontal: 16, // 左右のpadding
    paddingVertical: 24, // 上下のpadding
    bottom: 24,
  },
  pri: {
    color: '#EB6383'
  },
  logo: {
    width: 300, // 画像の幅
    height: 70,
    resizeMode: 'contain', // 画像を縮小せずにフィット
    marginBottom: 20,
    marginTop: 40
  },
  hr: {
    borderBottomColor: '#4d5156',
    borderBottomWidth: 3,
    marginBottom: 24
  },
  qustion : {
    color: '#EB6383',
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 16
  }, 
  answer: {
    marginBottom: 16,
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 20,
    color: '#4d5156'
  },
  newCreate: {
    marginTop:10,
    marginBottom: 30
  },
  answerlist: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 20,
    color: '#4d5156'
  }
});
