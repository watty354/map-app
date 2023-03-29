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
  if (props.action === "新規作成" || props.action === "フォロー申請一覧" || props.action === "始める" ){
    isPrimary= true;
  }
  return (
    <View style={styles.content}>
      <TouchableOpacity
        style={[
          styles.loginButton,
          isPrimary ? { backgroundColor: '#EB6383' } : null
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

