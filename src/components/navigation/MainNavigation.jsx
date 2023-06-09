import { View, StyleSheet, Platform, TouchableHighlight } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import BottomTabs from './BottomTabs';
import MyProfile from '../screens/MyProfile';
import Filters from '../screens/Filters';
import AddLead from '../screens/AddLead';
import LeadProfileNavigator from './LeadProfileNavigator';
import { styleConstants } from '../../services/Constants';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from '../screens/Login';
import TemporaryPassword from '../screens/TemporaryPassword';
import ForgotPassword from '../screens/ForgotPassword';
import { axiosContext } from '../../context/AxiosContext';
import AddBrokerSource from '../screens/AddBrokerSource';
import { contextData } from '../../context/DataContext';
import SearchScreen from '../screens/SearchScreen';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {

    const { group } = useContext(contextData);
    const { isLoggedIn } = useContext(axiosContext);

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator
                    // initialRouteName='Login'
                    screenOptions={({ route }) => ({
                        headerStyle: styles.headerStyle,
                        headerTitleAlign: "center",
                        headerShadowVisible: false,
                    })}
                >
                    {isLoggedIn ?
                        <>
                            <Stack.Screen name="BottomTabs" component={BottomTabs} options={{ headerShown: false }} />
                            <Stack.Screen name="Profile" component={MyProfile} />
                            <Stack.Screen name="Filters" component={Filters} />
                            <Stack.Screen name="Add Lead" component={AddLead} options={({navigation}) => ({
                                headerRight: () => {
                                    return group !== 'individual' &&
                                    <View style={styles.iconContainer} >
                                        <TouchableHighlight
                                            onPress={() => navigation.navigate('Add Broker Source')}
                                            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
                                        >
                                            <View style={styles.innerIconContainer}>
                                                <MaterialIcons name="add" color='#000000' size={32} />
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                },
                            })} />
                            <Stack.Screen name="Search Screen" component={SearchScreen} options={{ headerTitle: 'Project' }}/>
                            {group !== "individual" && <Stack.Screen name="Add Broker Source" component={AddBrokerSource} />}
                            <Stack.Screen name="LeadProfileNavigator" component={LeadProfileNavigator} />
                        </>
                        :
                        <>
                            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                            <Stack.Screen name="TemporaryPassword" component={TemporaryPassword} options={{ headerShown: false }} />
                            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
                        </>}
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}

export default MainNavigation

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: styleConstants.screenBackgroundColor,
    },
    iconContainer: {
        marginRight: 0,
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
})