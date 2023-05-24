import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const RecordCard = () => {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.buttonStyle}>
                <TouchableOpacity>
                    <Ionicons name='play-circle-outline' style={{ fontSize: 35 }} />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <Text style={styles.recordStyle}>Recording 1</Text>
                <Text style={styles.contentText}>Date</Text>
                <Text><Text style={styles.contentText}>Name - </Text><Text style={styles.phoneNumber}>Phone number</Text></Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: 394,
        height: 100,
        elevation: 5,
        backgroundColor: '#ffffff',
        top: 10,
        flexDirection: 'column'
    },
    buttonStyle: {
        marginLeft: 35,
        top: 30,
        position: 'absolute',
        flex: 1
    },
    content: {
        position: 'absolute',
        flex: 1,
        left: 100,
        top: 16
    },
    recordStyle: {
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 22.5
    },
    contentText: {
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 22.5,
    },
    phoneNumber: {
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 22.5,
    }
})

export default RecordCard