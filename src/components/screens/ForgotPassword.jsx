import { StyleSheet, Text, View, Dimensions, TextInput, ScrollView, Image, TouchableHighlight, Platform, KeyboardAvoidingView, Alert } from 'react-native'
import React, { useState } from 'react'
import { styleConstants } from '../../services/Constants'
import { ConfirmForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider"
import { cognito } from '../../services/AWSConfig'
import { REACT_APP_COGNITO_APP_CLIENT_ID } from "@env"

const initial = {
  code: '',
  password: '',
  confirmPassword: '',
}

const ForgotPassword = ({ navigation, route }) => {

  const [credentials, setCredentials] = useState(initial)

  const showAlert = (title, message) => {
    Alert.alert(title, message, [
      { text: 'OK', onPress: () => null },
    ])
  }

  const submit = async () => {
    if (credentials.code === '') {
      return showAlert('', 'Please enter the code sent on email.')
    }
    if (!(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ])[A-Za-z0-9^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ]{8,256}$/.test(credentials.password))) {
      return showAlert('', 'Password must contain a lower case letter, an upper case letter, a number, a special character or space, must not start or end with space and must contain at least 8 characters.')
    }
    if (credentials.password === '') {
      return showAlert('', 'Please enter the password.')
    }
    if (credentials.confirmPassword === '') {
      return showAlert('', 'Please confirm the entered password.')
    }
    if (credentials.password !== credentials.confirmPassword) {
      return showAlert('', 'Passwords do not match.')
    }
    // call api to change password
    const setPassword = new ConfirmForgotPasswordCommand({
      ClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID, /* required */
      ConfirmationCode: credentials.code, /* required */
      Password: credentials.password, /* required */
      Username: route.params.username, /* required */
    })
    try {
      const data = await cognito.send(setPassword)
      // console.log(data)
      setCredentials(initial)
      navigation.navigate('Login')
    } catch (err) {
      // console.log(err)
      showAlert('', err.message || 'Something went wrong. Please try again later')
    }
  }

  return (
    <View style={styles.mainContainer}>
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
      {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../../../assets/logo.png')} />
      </View>
      <View style={styles.formContainer}>
        <Text style={{ fontSize: 28, color: styleConstants.secondaryColor, fontWeight: 'bold', marginBottom: 10 }}>Change Password</Text>
        <Text style={{ marginBottom: 10 }}>We have sent a password reset code by email. Enter it below to reset your password.</Text>
        <View style={styles.formRow}>
          <Text style={styles.textLabel}>Code</Text>
          <TextInput
            cursorColor={styleConstants.primaryColor}
            onChangeText={(text) => setCredentials({ ...credentials, code: text })}
            style={styles.textInput}
            value={credentials.code}
            secureTextEntry={true}
          />
        </View>
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
          <TouchableHighlight
            onPress={() => submit()}
            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
          >
            <View style={styles.buttonContainer}>
              <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>Save</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
      {/* </KeyboardAvoidingView> */}
      {/* </ScrollView> */}
    </View>
  )
}

export default ForgotPassword

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