import { StyleSheet, Text, View, TouchableHighlight, Pressable, Modal, ScrollView } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import React, { useState } from 'react'
import Checkbox from 'expo-checkbox'
import { styleConstants } from '../../services/Constants'
// import { contextData } from '../../context/DataContext'

const ListMenu = ({ dropListItems, mapArray, onSelectHandler, defaultTitle, width, primaryFieldName, secondaryFieldName, nested, bgColor, textColor, onSelectOK }) => {

    // const { subBrokers } = useContext(contextData);
    const [dropListOpen, setDropListOpen] = useState(false);

    const handleSelect = (item) => {
        if (dropListItems.includes(nested ? item[primaryFieldName] : item)) {
            onSelectHandler(dropListItems.filter((value) => nested ? value !== item[primaryFieldName] : value !== item));
        } else {
            onSelectHandler([...dropListItems, nested ? item[primaryFieldName] : item]);
        }
    }

    const handleReset = () => {
        onSelectHandler([]);
    }

    const handleOK = () => {
        setDropListOpen(false);
        if (nested) {
            onSelectOK();
        }
    }

    return (
        <View style={[styles.container, { width: width ? width : '100%' }]}>
            <View style={styles.mainButtonContainer}>
                <TouchableHighlight
                    onPress={() => setDropListOpen(!dropListOpen)}
                    background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
                >
                    <View style={[styles.mainButton, { backgroundColor: bgColor }]}>
                        <Text style={{ flex: 1, color: textColor }} ellipsizeMode='tail' numberOfLines={1}>{(dropListItems.length > 0 && nested) ? mapArray.filter((elem) => dropListItems.includes(elem[primaryFieldName])).map((item) => item[secondaryFieldName]).join(", ") : (dropListItems.length > 0 && !nested) ? dropListItems.join(", ") : defaultTitle}</Text>
                        <AntDesign name="caretdown" size={12} color={textColor ? textColor : "black"} />
                    </View>
                </TouchableHighlight>
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
                            <Text style={styles.modalHeaderText}>{defaultTitle}</Text>
                        </View>
                        <ScrollView>
                            {mapArray.map((item, index) => {
                                return (
                                    <TouchableHighlight
                                        key={index}
                                        onPress={() => handleSelect(item)}
                                        background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
                                    >
                                        <View style={styles.modalItem}>
                                            <Checkbox
                                                style={styles.checkBox}
                                                value={dropListItems.includes(nested ? item[primaryFieldName] : item)}
                                                onValueChange={() => null}
                                                color={styleConstants.primaryColor}
                                            />
                                            <Text style={styles.modalItemText}>{nested ? item[secondaryFieldName] : item}</Text>
                                        </View>
                                    </TouchableHighlight>
                                )
                            })}
                        </ScrollView>
                        <View style={styles.buttonsBar}>
                            <View style={styles.buttonBox}>
                                <TouchableHighlight
                                    onPress={() => handleReset()}
                                    background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
                                >
                                    <View style={styles.buttonBoxInner}>
                                        <Text style={styles.buttonBoxText}>Clear All</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.buttonBox}>
                                <TouchableHighlight
                                    onPress={() => handleOK()}
                                    background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
                                >
                                    <View style={styles.buttonBoxInner}>
                                        <Text style={styles.buttonBoxText}>OK</Text>
                                    </View>
                                </TouchableHighlight>
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
        marginLeft: 15,
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