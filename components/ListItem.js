import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';

/**
 * 
 * @param {
 * imageUrl: 画像URL(strimg)
 * displayName: タイトル(strimg)
 * onPress: タップされた時のイベント
 * 
 * } props 
 * @returns 
 */

export const ListItem = (props) => {
    return (
        <TouchableOpacity style={styles.itemContainer} onPress={props.onPress}>
          <View style={styles.leftContainer}>
            <Image
              style={styles.image}
              source={{ url: props.imageUrl}}
            />
          </View>
          <View style={styles.rightContainer}>
            <Text numberOfLines={3} style={styles.displayName}>
              {props.displayName}</Text>
          </View>
      </TouchableOpacity>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    itemContainer: {
      height: 100,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 10,
    },
    displayName: {
      fontSize: 18,
      fontWeight: "bold",
    },
    subText: {
      fontSize: 14,
      color: "gray",
    }
  
  });