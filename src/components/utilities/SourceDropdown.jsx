import { StyleSheet, Text, View, TouchableNativeFeedback, Pressable, Modal, ScrollView } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import React, { useState, useContext } from 'react'
import Checkbox from 'expo-checkbox'
import { sourceArray } from '../../services/Constants'
import { styleConstants } from '../../services/Constants'
import { contextData } from '../../context/DataContext'

const ListMenu = ({ selectedSources, selectedBrokerSources, onSelectSources, onSelectBrokerSources, fieldTitle, width, bgColor, textColor }) => {

    const { group, brokerSources } = useContext(contextData);
    const [dropListOpen, setDropListOpen] = useState(false);

    const handleSelect = (item) => {
        if (selectedSources.includes(item)) {
            onSelectSources(selectedSources.filter((value) => value !== item));
        } else {
            onSelectSources([...selectedSources, item]);
        }
    }

    const handleReset = () => {
        onSelectSources([]);
        onSelectBrokerSources('', '');
    }

    return (
        <View style={[styles.container, { width: width ? width : '100%' }]}>
            <View style={styles.mainButtonContainer}>
                <TouchableNativeFeedback
                    onPress={() => setDropListOpen(!dropListOpen)}
                    background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
                >
                    <View style={[styles.mainButton, { backgroundColor: bgColor }]}>
                        <Text style={{ flex: 1, color: textColor }} ellipsizeMode='tail' numberOfLines={1}>{fieldTitle}</Text>
                        <AntDesign name="caretdown" size={12} color={textColor ? textColor : "black"} />
                    </View>
                </TouchableNativeFeedback>
            </View>
            <Modal
                visible={dropListOpen}
                onRequestClose={() => setDropListOpen(false)}
                transparent={true}
            >
                <Pressable
                    onPress={() => setDropListOpen(false)}
                    style={styles.modalBackground}
                >
                    <Pressable onPress={() => null} style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalHeaderText}>Select Sources</Text>
                        </View>
                        <ScrollView>
                            {sourceArray.map((item, index) => {
                                return (
                                    <TouchableNativeFeedback
                                        key={index}
                                        onPress={() => handleSelect(item)}
                                        background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
                                    >
                                        <View style={styles.modalItem}>
                                            <Checkbox
                                                style={styles.checkBox}
                                                value={selectedSources.includes(item)}
                                                onValueChange={() => null}
                                                color={styleConstants.primaryColor}
                                            />
                                            <Text style={styles.modalItemText}>{item}</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                )
                            })}
                            {group !== "individual" &&
                                <View style={styles.listHeaderContainer}>
                                    <Text style={styles.listHeading}>Broker Sources</Text>
                                </View>}
                            {group !== "individual" &&
                                brokerSources.map((item, index) => {
                                    return (
                                        <TouchableNativeFeedback
                                            key={index}
                                            onPress={() => onSelectBrokerSources(item.BSID, `${item.name} - ${item.companyName}`)}
                                            background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
                                        >
                                            <View style={styles.modalItem}>
                                                <Checkbox
                                                    style={styles.checkBox}
                                                    value={selectedBrokerSources === item.BSID}
                                                    onValueChange={() => null}
                                                    color={styleConstants.primaryColor}
                                                />
                                                <Text style={styles.modalItemText}>{`${item.name} - ${item.companyName}`}</Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    )
                                })}
                        </ScrollView>
                        <View style={styles.buttonsBar}>
                            <View style={styles.buttonBox}>
                                <TouchableNativeFeedback
                                    onPress={() => handleReset()}
                                    background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
                                >
                                    <View style={styles.buttonBoxInner}>
                                        <Text style={styles.buttonBoxText}>Clear All</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                            <View style={styles.buttonBox}>
                                <TouchableNativeFeedback
                                    onPress={() => setDropListOpen(false)}
                                    background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
                                >
                                    <View style={styles.buttonBoxInner}>
                                        <Text style={styles.buttonBoxText}>OK</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    )
}

export default ListMenu

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    mainButtonContainer: {
        borderRadius: 5,
        overflow: 'hidden',
        height: 50,
    },
    mainButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: '100%',
        overflow: 'hidden',
    },
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
        maxHeight: '80%',
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
        color: styleConstants.primaryColor,
    },
    modalItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    modalItemText: {
        marginHorizontal: 15,
    },
    listHeaderContainer: {
        backgroundColor: styleConstants.screenBackgroundColor,
        padding: 15,
    },
    listHeading: {
        color: styleConstants.tertiaryTextColor,
    },
    buttonsBar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        height: 70,
        paddingHorizontal: 10,
        width: '100%',
    },
    buttonBox: {
        height: 50,
        backgroundColor: styleConstants.primaryColor,
        width: '49%',
        borderRadius: 5,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        elevation: 3,
    },
    buttonBoxInner: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
    },
    buttonBoxText: {
        color: '#ffffff',
        textAlign: 'center'
    },
})