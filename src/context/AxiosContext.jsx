import { createContext, useState, useEffect } from "react";
import { ToastAndroid } from "react-native";
import { Alert } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { api } from "../services/Axios";
import { REACT_APP_API_URL } from "@env";
// import { Notifications } from 'expo';
// import * as Permissions from 'expo-permissions';

export const axiosContext = createContext();

const AxiosContext = (props) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isLoggedInCallback = (value) => {
    // setIsLoggedIn(true); 
       setIsLoggedIn(value);
  }

  // useEffect(() => {
  //   registerForPushNotificationsAsync();
  // }, []);

  // const registerForPushNotificationsAsync = async () => {
  //   const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //   if (status !== 'granted') {
  //     Alert.alert('You will not be able to receive notifications. Please grant notification permissions!')
  //     console.log('Permission to send push notifications not granted');
  //     return;
  //   }

  //   const token = await Notifications.getExpoPushTokenAsync();
  //   console.log(`Expo Push Token: ${token}`);
  // };

  useEffect(() => {
    api.interceptors.request.use(
      async (config) => {
        const idToken = await SecureStore.getItemAsync('idToken');
        if (idToken) {
          config.headers.Authorization = `Bearer ${idToken}`;
        } else {
          await SecureStore.deleteItemAsync('idToken')
          // setIsLoggedIn(true); 
                   setIsLoggedIn(false);
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    // Set up the interceptor
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        // console.log(error);
        // try {
        const token = await SecureStore.getItemAsync('idToken');
        if (error.response.data.message === 'auth_error' && token) {
          // await axios.get(`${process.env.REACT_APP_API_URL}/refresh_token`, {
          //     headers: {
          //         'Authorization': `Bearer ${getToken()}`,
          //     },
          // }).then((response) => {
          //     localStorage.setItem('token', response.data.id_token);
          //     return api.request(error.config);
          // }).catch((err) => {
          //     console.log(err);
          //     // logout();
          //     // return Promise.reject(error);
          // });
          // try {
          // console.log('about to logout');
          const response = await api.get(`${REACT_APP_API_URL}/logout`);
          if (response.data && response.data.message === "success") {
            await SecureStore.deleteItemAsync('idToken');
            await SecureStore.deleteItemAsync('expoToken');
              // console.log('deleted token');
            // setIsLoggedIn(true); 
                       setIsLoggedIn(false);
            ToastAndroid.show('Session expired', ToastAndroid.SHORT);
            // console.log('logged out');
          }
          // } catch (error) {
          //     console.log(error);
          // }
          return Promise.reject(error);
        } else {
          // console.log(error);
          // logout();
          return Promise.reject(error);
        }
        // } catch (error) {
        //     console.log(error, 'response error');
        // }
      }
    );


  }, [])


  return (
    <axiosContext.Provider
      value={{ isLoggedIn, isLoggedInCallback }}
    >
      {props.children}
    </axiosContext.Provider>
  )
}
export default AxiosContext;