import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import About from '../screens/About'
import Activities from '../screens/Activities'
import { styleConstants } from '../../services/Constants'

const Tab = createMaterialTopTabNavigator()

const LeadProfileNavigator = ({ navigation, route }) => {

    useEffect(() => {
        navigation.setOptions({ headerTitle: route.params.data.full_name, })
    }, [])
    
    return (
        <SafeAreaProvider>
            <Tab.Navigator
                initialRouteName='About'
                screenOptions={({ route }) => ({
                    tabBarLabelStyle: styles.tabBarLabelStyle,
                    tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
                    tabBarInactiveTintColor: '#000000',
                    tabBarActiveTintColor: '#000000',
                })}
            >
                <Tab.Screen name="About">
                    {() => <About lead={route.params.data} />}
                </Tab.Screen>
                <Tab.Screen name="Activities">
                    {() => <Activities lead={route.params.data} />}
                </Tab.Screen>
            </Tab.Navigator>
        </SafeAreaProvider>
    )
}

export default LeadProfileNavigator

const styles = StyleSheet.create({
    tabBarLabelStyle: {
        textTransform: 'capitalize',
        fontSize: 16,
    },
    tabBarIndicatorStyle: {
        backgroundColor: styleConstants.primaryColor,
        height: 4,
        borderRadius: 5,
    },
})