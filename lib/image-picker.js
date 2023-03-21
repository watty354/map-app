import React, { useState } from 'react';
import { Button, Image, StyleSheet, Text, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const ImagePickerComponent = () => {
  const [image, setImage] = useState(null);

  const handleChoosePhoto = async () => {
    if (Platform.OS !== 'web') {

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('カメラロールの許可が必要です');
            return;
        }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="写真を選択" onPress={handleChoosePhoto} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginTop: 16,
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

