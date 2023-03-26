import React from 'react';
import { View, Text, TouchableOpacity , StyleSheet} from 'react-native';

export const LoginPrompt = ({ onPress }) => {
  return (
    <View>
      <Text>ログインしてください</Text>
      <TouchableOpacity style={styles.loginButton} onPress={onPress}>
  <Text style={styles.loginButtonText}>ログイン</Text>
</TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
    loginButton: {
      backgroundColor: '#EB6383',
      paddingVertical: 10,
      paddingHorizontal: 20,
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
  
