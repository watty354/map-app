import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Button, Image } from 'react-native';
import * as Location from 'expo-location';

export const MapScreen = () => {
  //const { user } = route.params;

  const [mapRegion, setMapRegion] = useState({
    // 初期表示
    latitude: 34.665442,
    longitude: 135.516912,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markerVisible, setMarkerVisible] = useState(false);
  const markerTimer = useRef(null);


  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }
    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
    console.log(location.coords.latitude, location.coords.longitude);
  }

  useEffect(() => {
    userLocation();
  }, []);

  const handlePress = () => {
    if (!markerVisible) {
      setMarkerVisible(true);
      if (markerTimer.current) {
        clearTimeout(markerTimer.current);
      }
      markerTimer.current = setTimeout(() => {
        setMarkerVisible(false);
      }, 5000);
    }
  }
const photo = "https://firebasestorage.googleapis.com/v0/b/shop-57d77.appspot.com/o/profileImage%2F1679611710480.jpg?alt=media&token=44b46c82-d18c-414b-8b5e-8f0d8ec2ebdd"

  return (
    <View style={styles.container}>
      <MapView style={styles.map}
        region={mapRegion}
        provider={PROVIDER_GOOGLE}
      >
        {markerVisible && (

          <Marker
            coordinate={{
              latitude: mapRegion.latitude,
              longitude: mapRegion.longitude,
            }}
            title="光貴"
          >
            <Image
              source={{ uri: photo }}
              style={styles.markerImage}
            />
          </Marker>
        )}
        {/* {markerVisible && (
            <Marker
              coordinate={{
                latitude: mapRegion.latitude,
                longitude: mapRegion.longitude,
              }}
              title="現在位置"
              description="You are here!"
              image={{ uri: "https://firebasestorage.googleapis.com/v0/b/shop-57d77.appspot.com/o/profileImage%2F1679611710480.jpg?alt=media&token=44b46c82-d18c-414b-8b5e-8f0d8ec2ebdd" }}
              />
          )} */}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title='Get' onPress={handlePress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  markerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'red',
  },
});
