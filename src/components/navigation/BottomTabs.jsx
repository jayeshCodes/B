import { StyleSheet, TouchableHighlight, View, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useContext, useState } from 'react';
import { contextData } from '../../context/DataContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Dashboard from '../screens/Dashboard';
import Leads from '../screens/Leads';
import Reminders from '../screens/Reminders';
// import Recordings from '../screens/Recordings';
import { styleConstants } from '../../services/Constants';
import MyProfile from '../screens/MyProfile';
import SplashScreen from '../screens/SplashScreen';
import { axiosContext } from '../../context/AxiosContext';
import { api } from '../../services/Axios';
import { REACT_APP_API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
// async function sendPushNotification(expoPushToken) {
//   const message = {
//     to: expoPushToken,
//     sound: 'default',
//     title: 'Original Title',
//     body: 'And here is the body!',
//     data: { someData: 'goes here' },
//   };

//   await fetch('https://exp.host/--/api/v2/push/send', {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Accept-encoding': 'gzip, deflate',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(message),
//   });
// }

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Please enable notification permissions for timely updates about your leads!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log(token);
  } else {
    Alert.alert('Notifications are not supported currently on this device');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#ffffff',
    });
  }

  return token;
}

const Tab = createBottomTabNavigator();

const BottomTabs = ({ navigation }) => {

  const { isLoggedIn } = useContext(axiosContext);
  const { reminderCount, leadsTableDataCallback } = useContext(contextData);
  const [loading, setLoading] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const setExpoToken = async (token) => {
    try {
      const response = await api.post(`${process.env.REACT_APP_API_URL}/set_expo_token`, { token: token, idToken: await SecureStore.getItemAsync('idToken') })
      // console.log(response.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const checkToken = async () => {
    try {
        const response = await api.get(`${process.env.REACT_APP_API_URL}/check_token`);
        if (response.data.message === 'success') {
            return true;
        }
    } catch (error) {
        // console.log(error);
    }
    return false;
  }

  useEffect(() => {

    const getLeads = async () => {
      try {
        setLoading(true);
        const response = await api.get(`${process.env.REACT_APP_API_URL}/get?table=leads`);
        leadsTableDataCallback(response.data);
      } catch (err) {
        // setError(err.message);
        // console.log(err)
        leadsTableDataCallback([]);
      } finally {
        setLoading(false);
      };
    }

    registerForPushNotificationsAsync().then(async (token) => {
      setExpoToken(token)
      await SecureStore.setItemAsync('expoToken', token);
    });

    if (checkToken()) {
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        // console.log(notification.request.content);
      });
    }

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // console.log(response);
      if (response.notification.request.content.data.screen === 'leads' && isLoggedIn) {
        navigation.navigate('Leads');
      } else if (response.notification.request.content.data.screen === 'reminders' && isLoggedIn) {
        navigation.navigate('Reminders');
      }
    });

    getLeads();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <SafeAreaProvider>
      {/* <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      > */}
      {loading ? <SplashScreen /> : <Tab.Navigator
        initialRouteName='Dashboard'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icons = {
              Dashboard: 'home',
              Leads: 'account-multiple',
              Reminders: 'message-processing-outline',
              Profile: 'account-circle',
            }
            return (
              <MaterialCommunityIcons
                name={icons[route.name]}
                color={color}
                size={26}
              />
            );
          },
          headerLeft: () => (
            <Image style={styles.logo} source={require('../../../assets/logo.png')} />
          ),
          tabBarStyle: styles.tabBarStyle,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarIconStyle: styles.tabBarIconStyle,
          tabBarItemStyle: styles.tabBarItemStyle,
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.3)',
          headerStyle: styles.headerStyle,
          headerTitleAlign: "center",
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} options={{
          // headerLeft: () => (
          //   <TouchableHighlight onPress={() => navigation.navigate('Profile')}>
          //     <MaterialIcons name="account-circle" color='#000000' size={35} style={{ marginLeft: 10 }} />
          //   </TouchableHighlight>
          // ),
        }} />
        <Tab.Screen name="Leads" component={Leads} options={{
          headerRight: () => (
            <View style={styles.iconContainer} >
              <TouchableHighlight
                onPress={() => navigation.navigate('Add Lead')}
                background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
              >
                <View style={styles.innerIconContainer}>
                  <MaterialIcons name="add" color='#000000' size={32} />
                </View>
              </TouchableHighlight>
            </View>
          ),
        }} />
        <Tab.Screen name="Reminders" component={Reminders} options={reminderCount > 0 && {
          tabBarBadge: reminderCount,
          tabBarBadgeStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
        }} />
        {/* <Tab.Screen name="Recordings" component={Recordings} /> */}
        <Tab.Screen name="Profile" component={MyProfile} />
      </Tab.Navigator>}
      {/* </KeyboardAvoidingView> */}
    </SafeAreaProvider>
  );
}

export default BottomTabs;

const styles = StyleSheet.create({
  logo: {
    marginLeft: 10,
    width: 35,
    height: 35,
  },
  tabBarStyle: {
    backgroundColor: styleConstants.primaryColor,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderTopWidth: 0,
    minHeight: 70,
    elevation: 3,
  },
  tabBarLabelStyle: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  tabBarIconStyle: {
    marginTop: 5,
  },
  tabBarItemStyle: {
    marginBottom: 5,
  },
  headerStyle: {
    backgroundColor: styleConstants.screenBackgroundColor,
  },
  iconContainer: {
    marginRight: 15,
    height: 40,
    width: 40,
    borderRadius: 100,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerIconContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});