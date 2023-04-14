import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * 
 * @param {
* action: アクション(strimg)
* onPress: タップされた時のイベント
* 
* } props 
* @returns 
*/


export const ButtunPrompt = (props) => {
  let isPrimary = false;
  let isDispach = false;
  let idDelete = false;
  if (props.action === "新規作成" || props.action === "友達一覧" || props.action === "始める" || props.action ==="送信"){
    isPrimary= true;
  }
  if (props.action === "５秒でわかる使い方" || props.action === "フォロー解除" || props.action === "ブロック"){
    isDispach= true;
  }
  if (props.action === "アカウント削除" || props.action === "アカウントを削除する"){
    idDelete = true;
  }

  return (
    <View style={styles.content}>
      <TouchableOpacity
        style={[
          styles.loginButton,
          isPrimary ? { backgroundColor: '#EB6383' } : null,
          isDispach ? { backgroundColor: '#BDBDBD' } : null,
          idDelete ? { backgroundColor: '#4F4F4F' } : null,
        ]}
        onPress={props.onPress}
      >
        <Text style={styles.loginButtonText}>{props.action}</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  content: {
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: '#FA9191',
    paddingVertical: 15,
    width: 250,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

