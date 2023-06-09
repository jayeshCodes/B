import { FlatList, StyleSheet, Text, View, TouchableHighlight, Platform, ScrollView, Dimensions, Pressable, TextInput, Keyboard, ToastAndroid } from 'react-native'
import React, { useState, useRef, useEffect, useContext } from 'react'
import { styleConstants } from '../../services/Constants';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import moment from 'moment';
import { contextData } from '../../context/DataContext';
import { REACT_APP_API_URL } from '@env';
import { api } from '../../services/Axios';

const sortData = [
  'Date (Latest First)',
  'Date (Oldest First)',
  'Reminder Date (Latest First)',
  'Reminder Date (Oldest First)',
]

// const filterFields = [
//   'sortOrder',
//   'names',
//   'mobiles',
//   'source',
//   'propertyNames',
//   'propertyAreas',
//   'propertyTypes',
//   'dealTypes',
//   'statuses',
//   'assignedTo',
// ]

const Filters = ({ route, navigation }) => {

  const { group, filteredLeads, filteredLeadsCallback, filterObject, filterObjectCallback, resetFilterObjectCallback } = useContext(contextData);
  const [selectedList, setSelectedList] = useState('sortOrder');
  const [isFromDatePickerVisible, setFromDatePickerVisibility] = useState(false);
  const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);
  const [isReminderDatePickerVisible, setReminderDatePickerVisibility] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');

  const textInputRef = useRef(null);

  const showDatePicker = (pickerName) => {
    pickerName === 'fromDatePicker' ? setFromDatePickerVisibility(true) : pickerName === 'reminderDatePicker' ? setReminderDatePickerVisibility(true) : setToDatePickerVisibility(true);
  };

  const hideDatePicker = (pickerName) => {
    pickerName === 'fromDatePicker' ? setFromDatePickerVisibility(false) : pickerName === 'reminderDatePicker' ? setReminderDatePickerVisibility(false) : setToDatePickerVisibility(false);
  };

  const handleConfirm = (date, pickerName) => {
    const newDate = date !== "" ? moment(new Date(date)).format('DD/MM/YYYY') : "";
    filterObjectCallback(newDate, pickerName === 'fromDatePicker' ? 'dateStart' : pickerName === 'toDatePicker' ? 'dateEnd' : 'calenderDate')
    hideDatePicker(pickerName);
  };

  const isFilterOn = () => {
    if (filterObject.sortOrder !== "Date (Latest First)" || filterObject.dateStart !== "" || filterObject.dateEnd !== "" || filterObject.names.length !== 0 || filterObject.mobiles.length !== 0 || filterObject.source.length !== 0 || filterObject.brokerSources.length !== 0 || filterObject.propertyNames.length !== 0 || filterObject.propertyAreas.length !== 0 || filterObject.propertyTypes.length !== 0 || filterObject.dealTypes.length !== 0 || filterObject.statuses.length !== 0 || filterObject.calenderDate !== "" || filterObject.assignedTo.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

  const handleSelectAll = () => {
    if (filterObject[selectedList].length === route.params.filters[selectedList].length) {
      filterObjectCallback([], selectedList, true);
    } else {
      filterObjectCallback(selectedList !== 'assignedTo' ? route.params.filters[selectedList] : route.params.filters.assignedTo.map((item) => item.SBID), selectedList, true);
    }
  }

  const handleClearAll = () => {
    resetFilterObjectCallback();
    filteredLeadsCallback([]);
    setSearchText('');
  }

  const handleApply = async () => {
    try {
      const response = await api.post(`${process.env.REACT_APP_API_URL}/filter`, filterObject);
      // console.log(response.data)
      filteredLeadsCallback(response.data);
      navigation.navigate('Leads')
    } catch (err) {
      // console.log(err);
      ToastAndroid.show('Something went wrong, please try again later!', ToastAndroid.SHORT);
    }
  }

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (isFocused) {
        textInputRef.current.blur();
      }
    });

    return () => keyboardDidHideListener.remove();
  }, [isFocused]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonOuter}>
          <TouchableHighlight
            onPress={() => showDatePicker('fromDatePicker')}
            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
          >
            <View style={[styles.button, { backgroundColor: filterObject.dateStart === '' ? styleConstants.screenBackgroundColor : styleConstants.primaryColor }]}>
              <DateTimePickerModal
                isVisible={isFromDatePickerVisible}
                mode="date"
                onConfirm={(date) => handleConfirm(date, 'fromDatePicker')}
                onCancel={() => hideDatePicker('fromDatePicker')}
                locale="en-IN"
                maximumDate={filterObject.dateEnd !== '' ? new Date(moment(filterObject.dateEnd, 'DD/MM/YYYY').toDate()) : new Date()}
              />
              <Text style={[styles.buttonText, { color: filterObject.dateStart === '' ? '#000000' : '#ffffff' }]}>{filterObject.dateStart === '' ? 'From' : filterObject.dateStart}</Text>
              <MaterialCommunityIcons
                name={filterObject.dateStart === '' ? 'calendar-blank' : 'close-circle'}
                color={filterObject.dateStart === '' ? '#000000' : '#ffffff'}
                size={20}
                onPress={() => { filterObject.dateStart !== '' ? handleConfirm('', 'fromDatePicker') : null }}
              />
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.buttonOuter}>
          <TouchableHighlight
            onPress={() => showDatePicker('toDatePicker')}
            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
          >
            <View
              style={[styles.button, { backgroundColor: filterObject.dateEnd === '' ? styleConstants.screenBackgroundColor : styleConstants.primaryColor }]}
              onPress={() => showDatePicker('toDatePicker')}>
              <DateTimePickerModal
                isVisible={isToDatePickerVisible}
                mode="date"
                onConfirm={(date) => handleConfirm(date, 'toDatePicker')}
                onCancel={() => hideDatePicker('toDatePicker')}
                locale="en-IN"
                maximumDate={new Date()}
                minimumDate={filterObject.dateStart !== '' ? new Date(moment(filterObject.dateStart, 'DD/MM/YYYY').toDate()) : undefined}
              />
              <Text style={[styles.buttonText, { color: filterObject.dateEnd === '' ? '#000000' : '#ffffff' }]}>{filterObject.dateEnd === '' ? 'To' : filterObject.dateEnd}</Text>
              <MaterialCommunityIcons
                name={filterObject.dateEnd === '' ? 'calendar-blank' : 'close-circle'}
                color={filterObject.dateEnd === '' ? '#000000' : '#ffffff'}
                size={20}
                onPress={() => { filterObject.dateEnd !== '' ? handleConfirm('', 'toDatePicker') : null }}
              />
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.buttonOuter}>
          <TouchableHighlight
            onPress={() => showDatePicker('reminderDatePicker')}
            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
          >
            <View
              style={[styles.button, { backgroundColor: filterObject.calenderDate === '' ? styleConstants.screenBackgroundColor : styleConstants.primaryColor }]}
              onPress={() => showDatePicker('reminderDatePicker')}>
              <DateTimePickerModal
                isVisible={isReminderDatePickerVisible}
                mode="date"
                onConfirm={(date) => handleConfirm(date, 'reminderDatePicker')}
                onCancel={() => hideDatePicker('reminderDatePicker')}
                locale="en-IN"
              />
              <Text style={[styles.buttonText, { color: filterObject.calenderDate === '' ? '#000000' : '#ffffff' }]}>{filterObject.calenderDate === '' ? 'Reminder' : filterObject.calenderDate}</Text>
              <MaterialCommunityIcons
                name={filterObject.calenderDate === '' ? 'calendar-blank' : 'close-circle'}
                color={filterObject.calenderDate === '' ? '#000000' : '#ffffff'}
                size={20}
                onPress={() => { filterObject.calenderDate !== '' ? handleConfirm('', 'reminderDatePicker') : null }}
              />
            </View>
          </TouchableHighlight>
        </View>
      </View>
      <View style={styles.mainContent}>
        <ScrollView style={styles.leftBar} showsVerticalScrollIndicator={false}>
          {/* {filterFields.map((item) => {
              return (
                <TouchableHighlight
                key={item}
                  onPress={() => setSelectedList(item)}
                  background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
                >
                  <View style={[styles.leftBarButton, { backgroundColor: selectedList === item ? styleConstants.screenBackgroundColor : '#ffffff' }]}>
                    <Text></Text>
                    <View style={styles.indicator}></View>
                  </View>
                </TouchableHighlight>
              )
            })} */}
          <TouchableHighlight
            onPress={() => setSelectedList('sortOrder')}
            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
          >
            <View style={[styles.leftBarButton, { backgroundColor: selectedList === 'sortOrder' ? styleConstants.screenBackgroundColor : '#ffffff' }]}>
              <Text>Sort</Text>
              {filterObject.sortOrder !== "Date (Latest First)" && <View style={styles.indicator}></View>}
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => setSelectedList('names')}
            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
          >
            <View style={[styles.leftBarButton, { backgroundColor: selectedList === 'names' ? styleConstants.screenBackgroundColor : '#ffffff' }]}>
              <Text>Name</Text>
              {filterObject.names.length !== 0 && <View style={styles.indicator}></View>}
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => setSelectedList('mobiles')}
            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
          >
            <View style={[styles.leftBarButton, { backgroundColor: selectedList === 'mobiles' ? styleConstants.screenBackgroundColor : '#ffffff' }]}>
              <Text>Mobile</Text>
              {filterObject.mobiles.length !== 0 && <View style={styles.indicator}></View>}
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => setSelectedList('source')}
            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
          >
            <View style={[styles.leftBarButton, { backgroundColor: selectedList === 'source' ? styleConstants.screenBackgroundColor : '#ffffff' }]}>
              <Text>Source</Text>
              {filterObject.source.length !== 0 && <View style={styles.indicator}></View>}
            </View>
          </TouchableHighlight>
          {group !== "individual" &&
            <TouchableHighlight
              onPress={() => setSelectedList('brokerSources')}
              background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
            >
              <View style={[styles.leftBarButton, { backgroundColor: selectedList === 'brokerSources' ? styleConstants.screenBackgroundColor : '#ffffff' }]}>
                <Text>Broker Sources</Text>
                {filterObject.brokerSources.length !== 0 && <View style={styles.indicator}></View>}
              </View>
            </TouchableHighlight>}
          <TouchableHighlight
            onPress={() => setSelectedList('propertyNames')}
            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
          >
            <View style={[styles.leftBarButton, { backgroundColor: selectedList === 'propertyNames' ? styleConstants.screenBackgroundColor : '#ffffff' }]}>
              <Text>Project Name</Text>
              {filterObject.propertyNames.length !== 0 && <View style={styles.indicator}></View>}
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => setSelectedList('propertyAreas')}
            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
          >
            <View style={[styles.leftBarButton, { backgroundColor: selectedList === 'propertyAreas' ? styleConstants.screenBackgroundColor : '#ffffff' }]}>
              <Text>Location</Text>
              {filterObject.propertyAreas.length !== 0 && <View style={styles.indicator}></View>}
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => setSelectedList('propertyTypes')}
            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
          >
            <View style={[styles.leftBarButton, { backgroundColor: selectedList === 'propertyTypes' ? styleConstants.screenBackgroundColor : '#ffffff' }]}>
              <Text>Configuration</Text>
              {filterObject.propertyTypes.length !== 0 && <View style={styles.indicator}></View>}
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => setSelectedList('dealTypes')}
            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
          >
            <View style={[styles.leftBarButton, { backgroundColor: selectedList === 'dealTypes' ? styleConstants.screenBackgroundColor : '#ffffff' }]}>
              <Text>Deal Type</Text>
              {filterObject.dealTypes.length !== 0 && <View style={styles.indicator}></View>}
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => setSelectedList('statuses')}
            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
          >
            <View style={[styles.leftBarButton, { backgroundColor: selectedList === 'statuses' ? styleConstants.screenBackgroundColor : '#ffffff' }]}>
              <Text>Status</Text>
              {filterObject.statuses.length !== 0 && <View style={styles.indicator}></View>}
            </View>
          </TouchableHighlight>
          {group === "admin" &&
            <TouchableHighlight
              onPress={() => setSelectedList('assignedTo')}
              background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
            >
              <View style={[styles.leftBarButton, { backgroundColor: selectedList === 'assignedTo' ? styleConstants.screenBackgroundColor : '#ffffff' }]}>
                <Text>Assigned To</Text>
                {filterObject.assignedTo.length !== 0 && <View style={styles.indicator}></View>}
              </View>
            </TouchableHighlight>}
        </ScrollView>
        <View style={styles.rightBar}>
          {['names', 'mobiles', 'brokerSources', 'propertyNames', 'propertyAreas', 'assignedTo'].includes(selectedList) &&
            <Pressable
              style={styles.searchBarContainer}
              onPress={() => textInputRef.current.focus()}
            >
              <Ionicons name="search-outline" size={20} color={styleConstants.tertiaryTextColor} />
              <TextInput
                style={styles.searchBar}
                onChangeText={(value) => setSearchText(value)}
                value={searchText}
                placeholder="Search"
                placeholderTextColor={styleConstants.tertiaryTextColor}
                cursorColor={styleConstants.primaryColor}
                inputMode="search"
                ref={textInputRef}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {searchText !== '' && <Pressable
                onPress={() => setSearchText('')}
                style={styles.clearSearchIcon}
              >
                <MaterialCommunityIcons name="close" size={20} color={styleConstants.tertiaryTextColor} />
              </Pressable>}
            </Pressable>}
          {selectedList !== 'sortOrder' &&
            <TouchableHighlight
              onPress={() => handleSelectAll()}
              background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
            >
              <View style={styles.itemBox}>
                <Checkbox
                  style={styles.checkBox}
                  value={filterObject[selectedList].length === route.params.filters[selectedList].length && filterObject[selectedList].length !== 0}
                  onValueChange={() => null}
                  color={styleConstants.primaryColor}
                />
                <Text style={styles.itemBoxText}>Select All</Text>
              </View>
            </TouchableHighlight>}
          <View
            style={{ flex: 1 }}
          // showsVerticalScrollIndicator={false}
          >
            {selectedList === 'assignedTo' ?
              <FlatList
                data={route.params.filters.assignedTo}
                keyExtractor={(_, index) => index}
                renderItem={({ item }) => (
                  <TouchableHighlight
                    onPress={() => filterObjectCallback(item.SBID, 'assignedTo')}
                    background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
                  >
                    <View style={[styles.itemBox, { display: (searchText === '' || item.name.toLowerCase().includes(searchText.toLowerCase())) ? 'flex' : 'none' }]}>
                      <Checkbox
                        style={styles.checkBox}
                        value={filterObject.assignedTo.includes(item.SBID)}
                        onValueChange={() => null}
                        color={styleConstants.primaryColor}
                      />
                      <Text style={styles.itemBoxText}>{item.name}</Text>
                    </View>
                  </TouchableHighlight>
                )}
              />
              :
              selectedList === 'sortOrder' ?
                <FlatList
                  data={sortData}
                  keyExtractor={(_, index) => index}
                  renderItem={({ item }) => (
                    <TouchableHighlight
                      onPress={() => filterObjectCallback(item, 'sortOrder')}
                      background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
                    >
                      <View style={[styles.itemBox, { backgroundColor: filterObject.sortOrder === item ? styleConstants.primaryColor : 'transparent' }]}>
                        <Text style={filterObject.sortOrder === item && { color: '#ffffff' }}>{item}</Text>
                      </View>
                    </TouchableHighlight>
                  )}
                />
                // :
                // selectedList === 'source' ?
                //   <FlatList
                //     data={route.params.filters[selectedList].concat(route.params.filters.brokerSources)}
                //     keyExtractor={(_, index) => index}
                //     renderItem={({ item }) => (
                //       <TouchableHighlight
                //         onPress={() => filterObjectCallback(item, selectedList)}
                //         background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
                //       >
                //         <View style={[styles.itemBox, { display: (searchText === '' || item.toLowerCase().includes(searchText.toLowerCase())) ? 'flex' : 'none' }]}>
                //           <Checkbox
                //             style={styles.checkBox}
                //             value={filterObject[selectedList].includes(item)}
                //             onValueChange={() => null}
                //             color={styleConstants.primaryColor}
                //           />
                //           <Text style={styles.itemBoxText}>{item}</Text>
                //         </View>
                //       </TouchableHighlight>
                //     )}
                //   />
                :
                <FlatList
                  data={route.params.filters[selectedList]}
                  keyExtractor={(_, index) => index}
                  renderItem={({ item }) => (
                    <TouchableHighlight
                      onPress={() => filterObjectCallback(item, selectedList)}
                      background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
                    >
                      <View style={[styles.itemBox, { display: (searchText === '' || item.toLowerCase().includes(searchText.toLowerCase())) ? 'flex' : 'none' }]}>
                        <Checkbox
                          style={styles.checkBox}
                          value={filterObject[selectedList].includes(item)}
                          onValueChange={() => null}
                          color={styleConstants.primaryColor}
                        />
                        <Text style={styles.itemBoxText}>{item}</Text>
                      </View>
                    </TouchableHighlight>
                  )}
                />}
          </View>
        </View>
      </View>
      <View style={styles.buttonsBar}>
        <View style={styles.buttonBox}>
          <TouchableHighlight
            onPress={() => handleClearAll()}
            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
          >
            <View style={styles.buttonBoxInner}>
              <Text style={styles.buttonBoxText}>Clear All</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.buttonBox}>
          <TouchableHighlight
            onPress={() => handleApply()}
            background={Platform.OS === 'android' ? TouchableHighlight.SelectableBackground() : undefined}
          >
            <View style={styles.buttonBoxInner}>
              <Text style={styles.buttonBoxText}>OK</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  )
}

export default Filters

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: Dimensions.get('window').height,
    position: 'relative',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
  },
  buttonOuter: {
    width: '31.5%',
    height: 50,
    borderRadius: 5,
    overflow: 'hidden',
  },
  button: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
  leftBar: {
    width: '35%',
    backgroundColor: '#ffffff'
  },
  leftBarButton: {
    width: '100%',
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  indicator: {
    width: 5,
    height: 5,
    borderRadius: 100,
    backgroundColor: styleConstants.primaryColor,
  },
  rightBar: {
    width: '65%',
    height: '100%',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    position: 'relative',
  },
  searchBar: {
    height: 50,
    paddingLeft: 10,
    width: '100%',
    fontSize: 16,
  },
  clearSearchIcon: {
    position: 'absolute',
    right: 10,
  },
  itemBox: {
    width: '100%',
    height: 50,
    // display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  checkBox: {
    marginRight: 10,
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