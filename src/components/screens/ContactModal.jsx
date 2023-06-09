import { StyleSheet, Text, View, Modal, TouchableHighlight, Platform, Pressable, Alert, ToastAndroid } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Linking from 'expo-linking';
import React from 'react'
import { styleConstants } from '../../services/Constants'

const ContactModal = ({ modalVisible, closeModal, lead }) => {

    const openDialer = async () => {
        const url = `tel:+91${lead.phone}`;
        const supported = await Linking.openURL(url);
        if (supported) {
            return closeModal();
        } else {
            Alert.alert('Something went wrong, please try again later!');
            return closeModal();
        }
    }

    const openWhatsApp = async () => {
        let phoneNumber = '';
        if (Platform.OS === 'android') {
            phoneNumber = `whatsapp://send?phone=+91${lead.phone}`;
        } else {
            phoneNumber = `whatsapp://wa.me/+91${lead.phone}`;
        }
        const supported = await Linking.openURL(phoneNumber);
        if (supported) {
            return closeModal();
        } else {
            Alert.alert('Something went wrong, please try again later!');
            return closeModal();
        }
    };

    const sendEmail = async () => {
        if (!lead.email) {
            ToastAndroid.show('No email address found', ToastAndroid.SHORT);
            return closeModal();
        }
        const url = `mailto:${lead.email}`;
        const supported = await Linking.openURL(url);
        if (supported) {
            return closeModal();
        } else {
            Alert.alert('Something went wrong, please try again later!');
            return closeModal();
        }
    };

    return (
        <View>
            <Modal
                visible={modalVisible}
                onRequestClose={() => closeModal()}
                transparent={true}
            // animationType='slide'
            >
                <Pressable
                    onPress={() => closeModal()}
                    style={styles.modalBackground}
                >
                    {/* {loading && <ActivityIndicator size="large" color={styleConstants.primaryColor} style={styles.loading}/>} */}
                    <Pressable
                        style={styles.modalContainer}
                        onPress={() => null}
                    >
                        <TouchableHighlight
                            onPress={() => openDialer()}
                            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
                        >
                            <View style={styles.modalRow}>
                                <Text style={styles.modalRowText}>Call</Text>
                                <MaterialCommunityIcons
                                    name='phone-outgoing'
                                    color={styleConstants.primaryColor}
                                    size={26}
                                />
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={() => openWhatsApp()}
                            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
                        >
                            <View style={styles.modalRow}>
                                <Text style={styles.modalRowText}>WhatsApp</Text>
                                <MaterialCommunityIcons
                                    name='whatsapp'
                                    color={styleConstants.primaryColor}
                                    size={26}
                                />
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={() => sendEmail()}
                            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
                        >
                            <View style={styles.modalRow}>
                                <Text style={styles.modalRowText}>Email</Text>
                                <MaterialCommunityIcons
                                    name='email-outline'
                                    color={styleConstants.primaryColor}
                                    size={26}
                                />
                            </View>
                        </TouchableHighlight>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    )
}

export default ContactModal

const styles = StyleSheet.create({
    modalBackground: {
        backgroundColor: styleConstants.tertiaryTextColor,
        flex: 1,
        justifyContent: 'flex-end',
        position: 'relative',
    },
    modalContainer: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
        width: '100%',
    },
    modalRow: {
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 60,
    },
    modalRowText: {
        fontSize: 20,
        color: styleConstants.primaryColor,
    },
    loading: {
        alignSelf: 'center',
    }
})