import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const handleChoosePhoto = async () => {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('カメラロールの許可が必要です');
      return;
    }
  }
}


export const pickImage = async () => {
  await handleChoosePhoto();
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  if (!result.canceled) {
    return result.uri;
  }
};



