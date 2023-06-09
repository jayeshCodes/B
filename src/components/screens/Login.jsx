import { StyleSheet, Text, View, TextInput, Image, TouchableHighlight, Platform, KeyboardAvoidingView, Pressable, Alert } from 'react-native'
import React, { useState, useContext } from 'react'
import { styleConstants } from '../../services/Constants'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { cognito } from '../../services/AWSConfig'
import { InitiateAuthCommand, AdminGetUserCommand, ForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider"
import * as SecureStore from 'expo-secure-store';
import { REACT_APP_COGNITO_APP_CLIENT_ID, REACT_APP_COGNITO_USER_POOL_ID, REACT_APP_API_URL } from "@env"
import { axiosContext } from '../../context/AxiosContext'
import { api } from '../../services/Axios'

const initial = {
  username: '',
  password: '',
}

const Login = ({ navigation }) => {

  const { isLoggedInCallback } = useContext(axiosContext)

  const [credentials, setCredentials] = useState(initial)
  const [showPassword, setShowPassword] = useState(false)

  const showAlert = (title, message) => {
    Alert.alert(title, message, [
      { text: 'OK', onPress: () => null },
    ])
  }

  const signIn = async () => {
    if (credentials.username === '' || credentials.password === '') {
      return showAlert('', 'Please enter the username and password.')
    }
    const initiateAuthCommand = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH', /* required */
      ClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID, /* required */
      AuthParameters: {
        USERNAME: credentials.username,
        PASSWORD: credentials.password,
      },
    })
    try {
      const data = await cognito.send(initiateAuthCommand)
      if (data.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        setCredentials({ ...credentials, password: '' })
        return navigation.navigate('TemporaryPassword', { username: credentials.username })
      } else if (data.AuthenticationResult) {
        // store id token and access token in async storage.
        await SecureStore.setItemAsync('idToken', data.AuthenticationResult.IdToken);
        try {
          const res = await api.post(`${process.env.REACT_APP_API_URL}/check_pending`, { refresh_token: data.AuthenticationResult.RefreshToken });
          if (res.data.message && res.data.message === 'success') {
            isLoggedInCallback(true)
          }
        } catch (error) {
          // console.log(error)
        }
      }
    } catch (error) {
      // console.log(error)
      showAlert('', error.message)
    }
  }

  const forgotPassword = async () => {
    if (credentials.username === '') {
      return showAlert('', 'Please enter an email first!')
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(credentials.username))) {
      return showAlert('', 'Invalid username.')
    }
    const adminGetUser = new AdminGetUserCommand({
      UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID, /* required */
      Username: credentials.username, /* required */
    })
    try {
      const data = await cognito.send(adminGetUser)
      if (data.UserStatus !== 'CONFIRMED') {
        return showAlert('', 'Please login with temporary password or contact administrator.')
      }
      // console.log(data)
    } catch (error) {
      // console.error(error)
      return showAlert('', error.message)
    }
    const forgotPasswordCommand = new ForgotPasswordCommand({
      ClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID, /* required */
      Username: credentials.username, /* required */
    })
    try {
      const data = await cognito.send(forgotPasswordCommand)
      // console.log(data)
      navigation.navigate('ForgotPassword', { username: credentials.username })
    } catch (error) {
      // console.error(error)
      showAlert('', error.message)
    }
  }

  return (
    <View style={styles.mainContainer}>
      {/* <KeyboardAvoidingView behavior='position'> */}
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../../../assets/logo.png')} />
      </View>
      <View style={styles.formContainer}>
        <View style={styles.formRow}>
          <Text style={styles.textLabel}>Email</Text>
          <TextInput
            cursorColor={styleConstants.primaryColor}
            placeholder='Email'
            placeholderTextColor={styleConstants.tertiaryTextColor}
            keyboardType='email-address'
            onChangeText={(text) => setCredentials({ ...credentials, username: text })}
            style={styles.textInput}
            value={credentials.username}
          />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.textLabel}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              cursorColor={styleConstants.primaryColor}
              placeholder='Password'
              placeholderTextColor={styleConstants.tertiaryTextColor}
              secureTextEntry={showPassword ? false : true}
              onChangeText={(text) => setCredentials({ ...credentials, password: text })}
              style={{ flex: 1 }}
              value={credentials.password}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialCommunityIcons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={styleConstants.tertiaryTextColor} />
            </Pressable>
          </View>
        </View>
        <Text style={{ alignSelf: 'flex-end' }}>
          <Pressable
            onPress={() => forgotPassword()}
          >
            <Text style={{ color: styleConstants.tertiaryTextColor, marginBottom: 20, textDecorationLine: 'underline' }}>Forgot Password?</Text>
          </Pressable>
        </Text>
        <View style={styles.buttonOuter}>
          <TouchableHighlight
            onPress={() => signIn()}
            background={Platform.OS === 'android' ? TouchableHighlight : TouchableHighlight}
          >
            <View style={styles.buttonContainer}>
              <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>Login</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
      {/* </KeyboardAvoidingView> */}
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  mainContainer: {
    padding: 30,
  },
  logo: {
    height: 200,
    width: 200,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%',
  },
  formContainer: {
    height: '50%',
  },
  formRow: {
    marginBottom: 10,
  },
  passwordContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderRadius: 5,
    backgroundColor: styleConstants.tertiaryColor,
    elevation: 3,
    paddingHorizontal: 10,
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