import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * 
 * @param {
 * title: タイトル(strimg)
 * icon: アイコン(strimg)
 * onPress: タップされた時のイベント
 * } props 
 * @returns 
 */

export const SettingListItem = (props) => {
    return (
        <TouchableOpacity style={styles.itemContainer} onPress={props.onPress}>
            <View style={styles.leftContainer}>
                <Ionicons name={props.icon} size={24} />
            </View>
            <View style={styles.rightContainer}>
                <Text numberOfLines={3} style={styles.title}>
                    {props.title}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        
    },
    leftContainer: {
        marginRight: 10,
    },
    title: {
        fontSize: 18,
    },
});
