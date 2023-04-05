import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';

/**
 * 
 * @param {
 * imageUrl: 画像URL(strimg)
 * displayName: タイトル(strimg)
 * onPress: タップされた時のイベント
 * badge: バッジ(boolean)
 * } props 
 * @returns 
 */

export const ListItem = (props) => {
    return (
        <TouchableOpacity style={styles.itemContainer} onPress={props.onPress}>
          <View style={styles.leftContainer}>
          {props.imageUrl ? (
            <Image
              style={styles.image}
              source={{ url: props.imageUrl}}
            />
          ):(
            <Image
            source={require('../image/NoneImage.png')}
            style={styles.image} />
          )}
          </View>
          <View style={styles.rightContainer}>
            <Text numberOfLines={3} style={styles.displayName}>
              {props.displayName}</Text>
          </View>
              {props.badge && 
              <View style={styles.badge} />
              }
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
    }, 
    badge: {
      width: 12,
      height: 12,
      borderRadius: 8,
      backgroundColor: 'red',
      position: 'absolute',
      left: 55,
      top: 20,
    },
  
  });