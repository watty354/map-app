import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MapScreen } from './screens/Map';
import { HomeScreen } from './screens/HomeScreen';
import { RegisterScreen } from './screens/RegisterScreen'
import { LoginScreen } from './screens/LoginScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { AccuntScreen } from './screens/AccuntScreen'
import { ListScreen } from './screens/ListScreen'
import { UserScreen } from './screens/UserScreen'
import { ChatScreen } from './screens/ChatScreen'
import { UsageScreen } from './screens/UsageScreen'
import { ChatListScreen } from './screens/ChatList'
import { QRCodeScannerScreen } from './screens/QRCodeScannerScreen'
import { TermsOfServiceScreen } from './const/TermsOfServiceScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth, handleUploadPhoto } from './lib/firebase'
import Ionicons from '@expo/vector-icons/Ionicons';
import { store, persistor } from './store';
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const screenOption = ({ route }) => ({
  tabBarIcon: ({ color, size, focused }) => {
    let iconName;
    let iconColor = focused ? "#EB6383" : "#E0E0E0";

    if (route.name === 'HomeTab') {
      iconName = "home";
    } else if (route.name === 'MapTab') {
      iconName = "beer";
    } else if (route.name === 'AccuntTab') {
      iconName = "ios-people-sharp";
    } else if (route.name === 'ChatTab') {
      iconName = "chatbubbles";
    }

    return <Ionicons name={iconName} size={size} color={iconColor} />;
  },
});


const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Usage" component={UsageScreen} options={{ title: "使い方" }} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
    </Stack.Navigator>
  );
}

const MapStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
const AccuntStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Accunt" component={AccuntScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="List" component={ListScreen} />
      <Stack.Screen name="User" component={UserScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="QRCode" component={QRCodeScannerScreen} />
      <Stack.Screen name="Usage" component={UsageScreen} options={{ title: "使い方" }} />
    </Stack.Navigator>
  );
}
const ChatStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="List" component={ChatListScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          {user ? (
            <Tab.Navigator screenOptions={screenOption}>
              <Tab.Screen name="ChatTab" component={ChatStack} options={{ headerShown: false, title: "トーク", initialParams: { route: 'chat' } }} />
              <Tab.Screen name="MapTab" component={MapStack} options={{ headerShown: false, title: "マップ" }} />
              <Tab.Screen name="AccuntTab" component={AccuntStack} options={{ headerShown: false, title: "アカウント" }} />
            </Tab.Navigator>
          ) : (
            <Stack.Navigator>
              <Stack.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false }} />
            </Stack.Navigator>
          )}
        </NavigationContainer>

      </PersistGate>

    </Provider>
  );
}
