import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export const TermsOfServiceScreen = () => {
  return (
    <ScrollView>

    <View style={styles.container}>
      <Text style={styles.title}>利用規約</Text>
      <Text style={styles.text}>第1条　はじめに</Text>
      <Text style={styles.text}>
        この利用規約（以下，「本規約」といいます。）は，位置共有アプリ（以下，「当アプリ」といいます。）
        の利用条件を定めるものです。利用者の皆様には，本規約に従って当アプリを利用していただきます。
      </Text>
      <Text style={styles.text}>第2条　定義</Text>
      <Text style={styles.text}>
        本規約において使用する用語の定義は，以下の通りです。
        (1) 当アプリ：位置共有アプリをいいます。
        (2) 利用者：当アプリを利用する全ての方をいいます。
        (3) 位置情報：利用者の端末において生成される位置情報をいいます。
      </Text>
      <Text style={styles.text}>第3条　位置情報の利用について</Text>
      <Text style={styles.text}>
        当アプリでは，利用者の許諾を得た場合に限り，位置情報を取得し、共有することができます。
        利用者が位置情報の取得及び共有を停止することを希望する場合は、アプリの設定から停止することができます。
      </Text>
      <Text style={styles.text}>第4条　個人情報の取扱いについて</Text>
      <Text style={styles.text}>
        当アプリでは、利用者の個人情報を適切に取り扱います。詳しくは、当アプリのプライバシーポリシーをご覧ください。
      </Text>
      <Text style={styles.text}>第5条　禁止事項</Text>
      <Text style={styles.text}>
        利用者は、以下の行為を禁止します。
        (1) 本規約に違反する行為
        (2) 法令または公序良俗に違反する行為
        (3) 当アプリの運営に支障を与える行為
        (4) 他の利用者または第三者に対する迷惑行為
      </Text>
      <Text style={styles.text}>第6条　免責事項</Text>
      <Text style={styles.text}>
      本アプリの利用により、利用者の皆様に何らかの不利益が生じた場合でも、本アプリは一切の責任を負いかねます。
      また、本サービスを利用したことによりユーザーに何らかの損害が発生した場合でも、一切の責任を負いかねます。
      </Text>
      <Text style={styles.text}>以上の規約事項をご理解いただき、ご利用いただけますようお願い申し上げます。</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#FFFFFF',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    text: {
      fontSize: 16,
      marginBottom: 10,
    },
    link: {
      color: '#007AFF',
      textDecorationLine: 'underline',
    },
  });