import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import { styleConstants } from '../../services/Constants';

const SplashScreen = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={styleConstants.primaryColor} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default SplashScreen;