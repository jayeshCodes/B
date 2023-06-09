import { StyleSheet, Text, View, FlatList, TouchableHighlight, Pressable, Dimensions, Modal } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import React, { useState } from 'react'
import { styleConstants } from '../../services/Constants';

const DropDown = ({ dropListItems, onSelectHandler, width, defaultValue, primaryFieldName, secondaryFieldName, nested, bgColor, textColor }) => {

    const [dropListOpen, setDropListOpen] = useState(false);

    // console.log(defaultValue)
    const handleSelect = (item) => {
        setDropListOpen(false);
        onSelectHandler(nested ? item[primaryFieldName] : item);
        // console.log(selectedItem);
    }

    return (
        <View style={[styles.container, { width: width ? width : '40%' }]}>
            <View style={styles.buttonContainer}>
                <TouchableHighlight
                    onPress={() => setDropListOpen(!dropListOpen)}
                    background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
                >
                    <View style={[styles.button, { backgroundColor: bgColor }]}>
                        <Text style={{ flex: 1, color: textColor }} ellipsizeMode='tail' numberOfLines={1}>{defaultValue}</Text>
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
                    <Pressable onPress={() => null} style={styles.dropListContainer}>
                        <FlatList
                            keyExtractor={(_, index) => index}
                            data={dropListItems}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableHighlight
                                        onPress={() => handleSelect(item)}
                                        background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
                                    >
                                        <View style={styles.itemBox}>
                                            <Text>{nested ? item[secondaryFieldName] : item}</Text>
                                        </View>
                                    </TouchableHighlight>
                                )
                            }}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    )
}

export default DropDown

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    buttonContainer: {
        borderRadius: 5,
        overflow: 'hidden',
        height: 50,
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        // width: '47%',
        height: '100%',
        // borderRadius: 5,
        overflow: 'hidden',
    },
    dropListContainer: {
        width: '80%',
        maxHeight: Dimensions.get('window').height / 3,
        borderRadius: 5,
        overflow: 'hidden',
    },
    itemBox: {
        backgroundColor: '#ffffff',
        padding: 10,
        height: 50,
        display: 'flex',
        justifyContent: 'center',
    },
    modalBackground: {
        backgroundColor: styleConstants.tertiaryTextColor,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})