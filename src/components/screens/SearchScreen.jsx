import { ScrollView, StyleSheet, Text, TextInput, View, Pressable, TouchableNativeFeedback, Platform } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useState, useContext } from 'react'
import { contextData } from '../../context/DataContext'
import { styleConstants } from '../../services/Constants'

const SearchScreen = ({ navigation, route }) => {

    const { projects } = useContext(contextData);
    const [searchText, setSearchText] = useState(route.params.initialValue);
    const [projectSuggestions, setProjectSuggestions] = useState(projects.filter((item) => item.toLowerCase().includes(route.params.initialValue.toLowerCase())));

    const handleChange = (value) => {
        setSearchText(value);
        if (value !== '') {
            setProjectSuggestions(projects.filter((item) => item.toLowerCase().includes(value.toLowerCase())));
        } else {
            setProjectSuggestions(projects);
        }
    }

    const clearText = () => {
        setSearchText('');
        setProjectSuggestions(projects);
    }

    return (
        <View style={styles.mainContainer}>
            <Pressable style={styles.searchBarContainer}>
                <TextInput
                    style={styles.searchBar}
                    onChangeText={(value) => handleChange(value)}
                    autoFocus={true}
                    value={searchText}
                    placeholder="Ex: Supertech Twin Towers"
                    placeholderTextColor={styleConstants.tertiaryTextColor}
                    cursorColor={styleConstants.primaryColor}
                />
                {searchText !== '' && <Pressable
                    onPress={() => clearText()}
                    style={styles.clearSearchIcon}
                >
                    <MaterialCommunityIcons name="close" size={24} color={styleConstants.tertiaryTextColor} />
                </Pressable>}
            </Pressable>
            <ScrollView>
                {((/\S/.test(searchText)) && !projects.includes(searchText)) &&
                    <View style={styles.optionsContainer}>
                        <TouchableNativeFeedback
                            onPress={() => navigation.navigate('Add Lead', { selectedProject: searchText })}
                            background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
                        >
                            <View style={styles.innerContainer}>
                                <Text style={{ flex: 1, textAlignVertical: 'center' }} ellipsizeMode='tail' numberOfLines={1}>{searchText}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>}
                {projectSuggestions.map((item, index) => {
                    return (
                        <View key={index} style={styles.optionsContainer}>
                            <TouchableNativeFeedback
                                onPress={() => navigation.navigate('Add Lead', { selectedProject: item })}
                                background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
                            >
                                <View style={styles.innerContainer}>
                                    <Text style={{ flex: 1, textAlignVertical: 'center' }} ellipsizeMode='tail' numberOfLines={1}>{item}</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    )
}

export default SearchScreen

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: styleConstants.screenBackgroundColor,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        position: 'relative',
    },
    searchBar: {
        height: 50,
        paddingLeft: 20,
        paddingRight: 54,
        width: '100%',
        fontSize: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: styleConstants.tertiaryColor,
    },
    clearSearchIcon: {
        position: 'absolute',
        right: 20,
    },
    optionsContainer: {
        height: 50,
    },
    innerContainer: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: '100%',
        width: '100%',
    }
})