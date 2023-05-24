import { StyleSheet, Text, View, TextInput, ScrollView, Image, TouchableNativeFeedback, Platform, KeyboardAvoidingView, Alert, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { styleConstants } from '../../services/Constants'
import { AdminSetUserPasswordCommand } from "@aws-sdk/client-cognito-identity-provider"
import { cognito } from '../../services/AWSConfig'
import { REACT_APP_COGNITO_USER_POOL_ID } from "@env"

const initial = {
  password: '',
  confirmPassword: '',
}

const TemporaryPassword = ({ navigation, route }) => {

  const [credentials, setCredentials] = useState(initial)

  const showAlert = (title, message) => {
    Alert.alert(title, message, [
      { text: 'OK', onPress: () => null },
    ])
  }

  const save = async () => {
    if (!(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ])[A-Za-z0-9^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ]{8,256}$/.test(credentials.password))) {
      showAlert('', 'Password must contain a lower case letter, an upper case letter, a number, a special character or space, must not start or end with space and must contain at least 8 characters')
    } else if (credentials.password !== credentials.confirmPassword) {
      showAlert('', 'Passwords must match')
    } else {
      const setPassword = new AdminSetUserPasswordCommand({
        Password: credentials.password, /* required */
        UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID, /* required */
        Username: route.params.username, /* required */
        Permanent: true
      })
      try {
        const response = await cognito.send(setPassword)
        // console.log(response)
        if (response.$metadata.httpStatusCode === 200) {
          setCredentials(initial)
          ToastAndroid.show('Password changed successfully!', ToastAndroid.SHORT)
          navigation.navigate('Login')
        }
      } catch (err) {
        // console.log(err)
        showAlert('', err.message || 'Something went wrong. Please try again later')
      }
    }
  }

  return (
    <View style={styles.mainContainer}>
      {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../../../assets/logo.png')} />
      </View>
      <View style={styles.formContainer}>
        <Text style={{ fontSize: 28, color: styleConstants.secondaryColor, fontWeight: 'bold', marginBottom: 10 }}>Change Password</Text>
        <Text style={{ marginBottom: 10 }}>Please enter your new password below</Text>
        <View style={styles.formRow}>
          <Text style={styles.textLabel}>New Password</Text>
          <TextInput
            cursorColor={styleConstants.primaryColor}
            onChangeText={(text) => setCredentials({ ...credentials, password: text })}
            style={styles.textInput}
            value={credentials.password}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.textLabel}>Enter New Password Again</Text>
          <TextInput
            cursorColor={styleConstants.primaryColor}
            onChangeText={(text) => setCredentials({ ...credentials, confirmPassword: text })}
            style={styles.textInput}
            value={credentials.confirmPassword}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.buttonOuter}>
          <TouchableNativeFeedback
            onPress={() => save()}
            background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
          >
            <View style={styles.buttonContainer}>
              <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>Save</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
      {/* </KeyboardAvoidingView> */}
      {/* </ScrollView> */}
    </View>
  )
}

export default TemporaryPassword

const styles = StyleSheet.create({
  mainContainer: {
    padding: 30,
  },
  logo: {
    height: 150,
    width: 150,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '35%',
  },
  formContainer: {
    height: '65%',
  },
  formRow: {
    marginBottom: 10,
  },
  textInput: {
    height: 50,
    borderRadius: 5,
    backgroundColor: styleConstants.tertiaryColor,
    elevation: 3,
    paddingHorizontal: 10,
  },
  textLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonOuter: {
    borderRadius: 5,
    marginTop: 20,
    overflow: 'hidden',
    elevation: 3,
  },
  buttonContainer: {
    backgroundColor: styleConstants.secondaryColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
})