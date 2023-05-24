import { StyleSheet, Text, View, Modal, TouchableNativeFeedback, Platform, Pressable, ScrollView, KeyboardAvoidingView, TextInput, ToastAndroid } from 'react-native'
import React, { useContext, useState } from 'react'
import { statusArray, styleConstants, reminderStatusArray } from '../../services/Constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DropDown from '../utilities/DropDown';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { api } from '../../services/Axios';
import { contextData } from '../../context/DataContext';

const Edit = ({ lead, modalVisible, closeModal }) => {

    const { leadsTableData, leadsTableDataCallback, tasksData, tasksDataCallback, filteredLeads, filteredLeadsCallback } = useContext(contextData);
    const [selectedItem, setSelectedItem] = useState(lead.status);
    const [isActivityDatePickerVisible, setActivityDatePickerVisibility] = useState(false);
    const [isReminderDatePickerVisible, setReminderDatePickerVisibility] = useState(false);
    const [activityDate, setActivityDate] = useState(moment(new Date()).format('DD/MM/YYYY'));
    const [reminderDate, setReminderDate] = useState(moment(new Date()).add(1, 'days').format('DD/MM/YYYY'));
    const [remarks, setRemarks] = useState(lead.remarks);

    const showDatePicker = (pickerName) => {
        pickerName === 'activityDatePicker' ? setActivityDatePickerVisibility(true) : setReminderDatePickerVisibility(true);
    };

    const hideDatePicker = (pickerName) => {
        pickerName === 'activityDatePicker' ? setActivityDatePickerVisibility(false) : setReminderDatePickerVisibility(false);
    };

    const handleConfirm = (date, pickerName) => {
        const newDate = moment(new Date(date)).format('DD/MM/YYYY')
        pickerName === 'activityDatePicker' ? setActivityDate(newDate) : setReminderDate(newDate);
        hideDatePicker(pickerName);
    };

    const closeFunction = () => {
        setSelectedItem(lead.status);
        setActivityDate(moment(new Date()).format('DD/MM/YYYY'));
        setReminderDate(moment(new Date()).add(1, 'days').format('DD/MM/YYYY'));
        setRemarks(lead.remarks);
        closeModal();
    }

    const handleSave = async () => {
        if (selectedItem !== lead.status || activityDate !== lead.activity_date || reminderDate !== lead.scheduled_date || remarks !== lead.remarks) {
            api.post(`${process.env.REACT_APP_API_URL}/update`, {
                leadId: lead.LID,
                newStatus: selectedItem,
                newActivityDate: activityDate,
                newReminderDate: reminderDate,
                newRemarks: remarks
            })
                .then((response) => {
                    // console.log(response);
                    leadsTableDataCallback(leadsTableData.map((item) => item.LID === lead.LID ? response.data[0] : item));
                    filteredLeadsCallback(filteredLeads.map((item) => item.LID === lead.LID ? response.data[0] : item))
                    if (["Incoming", ...reminderStatusArray].includes(response.data[0].status)) {
                        if (tasksData.some((item) => item.LID === lead.LID)) {
                            tasksDataCallback(tasksData.map((item) => item.LID === lead.LID ? response.data[0] : item));
                        } else {
                            tasksDataCallback([...tasksData, response.data[0]]);
                        }
                    } else {
                        tasksDataCallback(tasksData.filter((item) => item.LID !== lead.LID));
                    }
                })
                .catch((error) => {
                    // console.log(error);
                    ToastAndroid.show('Something went wrong. Please try again later!', ToastAndroid.SHORT)
                })
        }
        closeFunction();
    };

    return (
        <View>
            <Modal
                visible={modalVisible}
                onRequestClose={() => closeFunction()}
                transparent={true}
                animationType='fade'
            >
                <Pressable
                    onPress={() => closeFunction()}
                    style={styles.modalBackground}
                >
                    {/* <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    > */}
                    <Pressable
                        style={styles.modalContainer}
                        onPress={() => null}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalHeaderText}>Update</Text>
                            <Pressable
                                onPress={() => closeFunction()}
                                style={styles.closeModalIcon}
                            >
                                <MaterialCommunityIcons name="close" size={24} color={styleConstants.tertiaryTextColor} />
                            </Pressable>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            <View>
                                <Text style={{ marginBottom: 5 }}>Status</Text>
                                <DropDown
                                    dropListItems={statusArray}
                                    defaultValue={selectedItem}
                                    onSelectHandler={(value) => setSelectedItem(value)}
                                    width='100%'
                                    bgColor={styleConstants.screenBackgroundColor}
                                />
                            </View>
                            <View style={styles.modalBodyRow}>
                                <Text style={{ marginBottom: 5 }}>Activity Date</Text>
                                <View style={styles.buttonOuter}>
                                    <TouchableNativeFeedback
                                        onPress={() => showDatePicker('activityDatePicker')}
                                        background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
                                    >
                                        <View style={styles.button}>
                                            <DateTimePickerModal
                                                isVisible={isActivityDatePickerVisible}
                                                mode="date"
                                                onConfirm={(date) => handleConfirm(date, 'activityDatePicker')}
                                                onCancel={() => hideDatePicker('activityDatePicker')}
                                                locale="en-IN"
                                                maximumDate={new Date()}
                                            />
                                            <Text style={styles.buttonText}>{activityDate}</Text>
                                            <MaterialCommunityIcons
                                                name='calendar-blank'
                                                color='#000000'
                                                size={20} />
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                            </View>
                            {reminderStatusArray.includes(selectedItem) && <View style={styles.modalBodyRow}>
                                <Text style={{ marginBottom: 5 }}>Reminder Date</Text>
                                <View style={styles.buttonOuter}>
                                    <TouchableNativeFeedback
                                        onPress={() => showDatePicker('reminderDatePicker')}
                                        background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
                                    >
                                        <View style={styles.button}>
                                            <DateTimePickerModal
                                                isVisible={isReminderDatePickerVisible}
                                                mode="date"
                                                onConfirm={(date) => handleConfirm(date, 'reminderDatePicker')}
                                                onCancel={() => hideDatePicker('reminderDatePicker')}
                                                locale="en-IN"
                                                minimumDate={new Date()}
                                            />
                                            <Text style={styles.buttonText}>{reminderDate}</Text>
                                            <MaterialCommunityIcons
                                                name='calendar-blank'
                                                color='#000000'
                                                size={20} />
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                            </View>}
                            <View style={styles.modalBodyRow}>
                                <Text style={{ marginBottom: 5 }}>Remarks</Text>
                                <TextInput
                                    multiline={true}
                                    numberOfLines={4}
                                    onChangeText={text => setRemarks(text)}
                                    value={remarks}
                                    style={styles.remarksInput}
                                    cursorColor={styleConstants.primaryColor}
                                />
                            </View>
                        </ScrollView>
                        <View style={styles.modalFooter}>
                            <TouchableNativeFeedback
                                onPress={() => handleSave()}
                                background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                            >
                                <View style={styles.buttonContainer}>
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </Pressable>
                    {/* </KeyboardAvoidingView> */}
                </Pressable>
            </Modal>
        </View>
    )
}

export default Edit

const styles = StyleSheet.create({
    modalBackground: {
        backgroundColor: styleConstants.tertiaryTextColor,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        overflow: 'hidden',
        width: '80%',
        height: 450,
        position: 'relative',
    },
    modalHeader: {
        padding: 10,
        height: 55,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalHeaderText: {
        fontSize: 20,
        color: styleConstants.primaryColor,
    },
    closeModalIcon: {
        position: 'absolute',
        right: 10,
        top: 15.5,
    },
    modalBody: {
        flex: 1,
        paddingHorizontal: 10,
        paddingBottom: 60,
        display: 'flex',
        maxHeight: 335,
    },
    modalBodyRow: {
        marginTop: 10,
    },
    modalFooter: {
        padding: 5,
        height: 60,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    buttonContainer: {
        backgroundColor: styleConstants.primaryColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderRadius: 5,
        elevation: 3,
    },
    saveButtonText: {
        fontSize: 20,
        color: '#ffffff',
    },
    buttonOuter: {
        width: '100%',
        height: 50,
        borderRadius: 5,
        overflow: 'hidden',
    },
    button: {
        width: '100%',
        height: 50,
        paddingHorizontal: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: styleConstants.screenBackgroundColor,
    },
    remarksInput: {
        backgroundColor: styleConstants.screenBackgroundColor,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        minHeight: 50,
        maxHeight: 100,
    },
})