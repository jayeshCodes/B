import { StyleSheet, Text, TouchableHighlight, View, ScrollView, Switch } from 'react-native'
import React, { useContext } from 'react'
import { styleConstants } from '../../services/Constants'
import * as SecureStore from 'expo-secure-store';
import { axiosContext } from '../../context/AxiosContext';
import { contextData } from '../../context/DataContext';
import { api } from '../../services/Axios';
import { REACT_APP_API_URL } from "@env";
import { RNCToast } from 'react-native-toast';


const MyProfile = () => {

  const { isLoggedInCallback } = useContext(axiosContext)
  const { group, profile, profileCallback } = useContext(contextData);

  const logout = async () => {
    // if (profile) {

      try {
        const token = await SecureStore.getItemAsync('expoToken');
        const response = await api.post(`${process.env.REACT_APP_API_URL}/remove_expo_token`, { token: token })
        if (response.data.message === 'success') {
          await SecureStore.deleteItemAsync('idToken');
          await SecureStore.deleteItemAsync('expoToken');
          isLoggedInCallback(false);
        }
        // console.log(response.data);
      } catch (error) {
        // console.log(error);
        RNCToast.show('Something went wrong, please try again later!', RNCToast.SHORT);
      }
    // }
  }



  const switchEmail = () => {
    api.get(`${process.env.REACT_APP_API_URL}/toggle_email`)
      .then((response) => {
        // console.log(response.data);
        profileCallback(response.data);
      })
      .catch((error) => {
        // console.log(error);
        RNCToast.show('Something went wrong, please try again later!', RNCToast.SHORT);
      })
  }

  return (
    <View>
      <ScrollView style={styles.mainContainer}>
        <View style={styles.cardContainer}>
          <Text style={styles.nameInitial}>{profile.firstName && profile.firstName[0].toUpperCase()}</Text>
          <Text style={styles.profileId}>{profile.userId}</Text>
        </View>
        <View style={styles.profileCard}>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowTitle}>Name</Text>
            <Text style={styles.cardRowText}>{profile.firstName} {profile.lastName}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowTitle}>Phone</Text>
            <Text style={styles.cardRowText}>{profile.phone}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowTitle}>Email</Text>
            <Text style={styles.cardRowText}>{profile.email}</Text>
          </View>
          {group !== "employee" && <View style={styles.cardRow}>
            <Text style={styles.cardRowTitle}>RERA ID</Text>
            <Text style={styles.cardRowText}>{profile.reraId}</Text>
          </View>}
          <View style={styles.cardRow}>
            <Text style={styles.cardRowTitle}>Company Name</Text>
            <Text style={styles.cardRowText}>{profile.companyName}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowTitle}>Company Address</Text>
            <Text style={[styles.cardRowText, { flex: 1 }]} ellipsizeMode='tail' numberOfLines={3}>{profile.companyAddress}</Text>
          </View>
        </View>
        {group !== "employee" &&
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Automated Emails</Text>
            <Switch
              trackColor={{ false: styleConstants.tertiaryTextColor, true: styleConstants.tertiaryColor }}
              thumbColor={!profile.email_toggle ? styleConstants.primaryColor : styleConstants.screenBackgroundColor}
              onValueChange={() => switchEmail()}
              value={!profile.email_toggle}
            />
          </View>}
        <View style={styles.logoutContainer}>
          <TouchableHighlight
            onPress={() => logout()}
            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
            style={{ width: "100%", height: "100%", borderRadius: 10 }}
          >
            <View style={styles.logoutInner}>
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </View>
  )
}

export default MyProfile

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: styleConstants.primaryColor,
    // height: 250,
    borderRadius: 10,
  },
  nameInitial: {
    fontSize: 125,
    color: '#ffffff',
  },
  profileId: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    fontStyle: 'italic',
    paddingBottom: 20,
    width: '100%',
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    elevation: 3,
  },
  cardRow: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 5,
  },
  cardRowTitle: {
    color: styleConstants.secondaryColor,
    width: '39%',
  },
  cardRowText: {
    flex: 1,
    color: styleConstants.tertiaryTextColor,
  },
  logoutContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    height: 60,
    elevation: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutInner: {
    backgroundColor: styleConstants.primaryColor,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 60,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    elevation: 3,
  },
  switchText: {
    fontSize: 20,
    color: styleConstants.primaryColor,
  },
})