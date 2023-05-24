import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { styleConstants } from './src/services/Constants';
import MainNavigation from './src/components/navigation/MainNavigation';
import WithAuth from './src/components/utilities/WithAuth';

const App = () => {

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor={styleConstants.primaryColor} />
        <MainNavigation />
      </View>
    </SafeAreaProvider>
  );
}

export default WithAuth(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleConstants.screenBackgroundColor,
  },
});