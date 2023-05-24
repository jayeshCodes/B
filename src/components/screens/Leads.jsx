import { View, Text, StyleSheet, Pressable, TouchableNativeFeedback, TextInput, FlatList, Keyboard, Platform, ToastAndroid, RefreshControl } from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { Feather } from '@expo/vector-icons'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { styleConstants } from '../../services/Constants';
import Edit from './Edit'
import ContactModal from './ContactModal'
import { sourceArray, propertyTypesArray, dealTypesArray, statusArray } from '../../services/Constants'
import SplashScreen from './SplashScreen'
import { contextData } from '../../context/DataContext'
import { api } from '../../services/Axios'
import moment from 'moment'

const filters = {
  names: [],
  mobiles: [],
  source: sourceArray,
  brokerSources: [],
  propertyNames: [],
  propertyAreas: [],
  propertyTypes: propertyTypesArray,
  dealTypes: dealTypesArray,
  statuses: statusArray,
  assignedTo: []
}

const Leads = ({ navigation }) => {

  const { leadsTableData, leadsTableDataCallback, filteredLeads, group, filterObject } = useContext(contextData);
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [contactModalLead, setContactModalLead] = useState({});
  const [editModalLead, setEditModalLead] = useState({});
  const [leadCards, setLeadCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const textInputRef = useRef(null);

  const closeContactModal = () => {
    setContactModalLead({});
  }

  const closeEditModal = () => {
    setEditModalLead({});
  }

  const isFilterOn = () => {
    if (filterObject.sortOrder !== "Date (Latest First)" || filterObject.dateStart !== "" || filterObject.dateEnd !== "" || filterObject.names.length !== 0 || filterObject.mobiles.length !== 0 || filterObject.source.length !== 0 || filterObject.brokerSources.length !== 0 || filterObject.propertyNames.length !== 0 || filterObject.propertyAreas.length !== 0 || filterObject.propertyTypes.length !== 0 || filterObject.dealTypes.length !== 0 || filterObject.statuses.length !== 0 || filterObject.calenderDate !== "" || filterObject.assignedTo.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

  const filterFields = (value) => {
    filters.names = [];
    filters.mobiles = [];
    filters.source = sourceArray;
    filters.brokerSources = [];
    filters.propertyNames = [];
    filters.propertyAreas = [];
    filters.propertyTypes = propertyTypesArray;
    filters.dealTypes = dealTypesArray;
    filters.statuses = statusArray;
    filters.assignedTo = [];
    value.filter((element) => {
      if (!filters.names.includes(element.full_name) && element.full_name !== "") {
        filters.names.push(element.full_name);
      }
      if (!filters.mobiles.includes(element.phone) && element.phone !== "") {
        filters.mobiles.push(element.phone);
      }
      if (!filters.propertyNames.includes(element.interested_property) && element.interested_property !== "") {
        filters.propertyNames.push(element.interested_property);
      }
      if (!filters.propertyAreas.includes(element.property_area) && element.property_area !== "") {
        filters.propertyAreas.push(element.property_area);
      }
      if (!filters.assignedTo.some((elem) => elem.SBID === element.SBID)) {
        filters.assignedTo.push({ SBID: element.SBID, name: element.SB_name });
      }
      for (let x in element.source) {
        if (!filters.source.includes(element.source[x]) && !filters.brokerSources.includes(element.source[x]) && element.source[x] !== "") {
          filters.brokerSources.push(element.source[x]);
        }
      }
      return null;
    });
  }

  const getLeads = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${process.env.REACT_APP_API_URL}/get?table=leads`);
      leadsTableDataCallback(response.data);
    } catch (err) {
      // setError(err.message);
      // console.log(err)
      ToastAndroid.show('Something went wrong. Please try again later!', ToastAndroid.SHORT)
      leadsTableDataCallback([]);
    } finally {
      setLoading(false);
    };
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getLeads();
    setRefreshing(false);
  }, []);

  // useEffect(() => {
  //   getLeads();
  // }, [])

  useEffect(() => {
    if (isFilterOn()) {
      setLeadCards(filteredLeads);
    } else {
      setLeadCards(leadsTableData);
    }
  }, [leadsTableData, filteredLeads])

  useEffect(() => {
    setIsLoading(true)
    if (searchText === "") {
      setLeadCards(isFilterOn() ? filteredLeads : leadsTableData);
    } else {
      const filteredData = leadsTableData.filter((element) => {
        return element.LID.toString().toLowerCase().includes(searchText.toLowerCase()) ||
          element.SB_name.toLowerCase().includes(searchText.toLowerCase()) ||
          element.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
          element.phone.toLowerCase().includes(searchText.toLowerCase()) ||
          element.email.toLowerCase().includes(searchText.toLowerCase()) ||
          element.interested_property.toLowerCase().includes(searchText.toLowerCase()) ||
          element.property_area.toLowerCase().includes(searchText.toLowerCase()) ||
          element.SB_name.toLowerCase().includes(searchText.toLowerCase()) ||
          element.source.some((elem) => elem.toLowerCase().includes(searchText.toLowerCase())) ||
          element.budget.toLowerCase().includes(searchText.toLowerCase()) ||
          element.deal_type.toLowerCase().includes(searchText.toLowerCase()) ||
          element.leadAddress.toLowerCase().includes(searchText.toLowerCase()) ||
          element.leadCity.toLowerCase().includes(searchText.toLowerCase()) ||
          element.lead_date.toLowerCase().includes(searchText.toLowerCase()) ||
          element.remarks.toLowerCase().includes(searchText.toLowerCase()) ||
          element.status.toLowerCase().includes(searchText.toLowerCase()) ||
          ((element.scheduled_date !== null && element.scheduled_date !== '') ? element.scheduled_date.toLowerCase().includes(searchText.toLowerCase()) : false)
      });
      setLeadCards(filteredData);
    }
    setIsLoading(false);
  }, [searchText])

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (isFocused) {
        textInputRef.current.blur();
      }
    });
    return () => keyboardDidHideListener.remove();
  }, [isFocused]);

  useEffect(() => {
    filterFields(leadsTableData);
  }, [leadsTableData])

  return (
    <>
      {loading ? <SplashScreen /> : <>
        <View style={styles.pageHeaderBar}>
          <Pressable
            style={styles.searchBarContainer}
            onPress={() => textInputRef.current.focus()}
          >
            <Ionicons name="search-outline" size={24} color={styleConstants.tertiaryTextColor} />
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
              <MaterialCommunityIcons name="close" size={24} color={styleConstants.tertiaryTextColor} />
            </Pressable>}
          </Pressable>
          <View style={{ borderRadius: 100, overflow: 'hidden' }}>
            <TouchableNativeFeedback
              onPress={() => navigation.navigate('Filters', { filters: filters })}
              background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
              useForeground={true}
            >
              <View style={[styles.filterButton, { backgroundColor: isFilterOn() ? styleConstants.primaryColor : '#ffffff' }]}>
                <Ionicons name="filter" size={24} color={isFilterOn() ? '#ffffff' : '#000000'} />
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
        {isLoading ? <SplashScreen /> :
          leadCards.length === 0 ?
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ alignSelf: 'center' }}>No leads</Text>
            </View>
            :
            <FlatList
              keyExtractor={(_, index) => index}
              data={leadCards}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[styleConstants.primaryColor]} />
              }
              renderItem={({ item }) => {
                return (
                  <>
                    <View style={styles.cardContainer}>
                      <TouchableNativeFeedback
                        onPress={() => navigation.navigate('LeadProfileNavigator', { data: item })}
                        useForeground={true}
                      >
                        <View>
                          <View style={styles.cardHeading}>
                            <Text style={styles.cardHeadingText}>{item.full_name}</Text>
                            <TouchableNativeFeedback
                              onPress={() => setContactModalLead(item)}
                              background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
                              useForeground={true}
                            >
                              <View style={styles.moreButton}>
                                <MaterialIcons name="call" size={20} color="#ffffff" />
                              </View>
                            </TouchableNativeFeedback>
                          </View>
                          <View style={styles.cardBody}>
                            <View style={styles.cardBodyRow}>
                              <Text style={styles.cardBodyRowTitle}>Date</Text>
                              <Text style={styles.cardBodyRowText}>{(item.lead_date !== null && item.lead_date !== '') ? moment(item.lead_date).format('DD/MM/YYYY hh:mm a') : item.lead_date}</Text>
                            </View>
                            <View style={styles.cardBodyRow}>
                              <Text style={styles.cardBodyRowTitle}>Source</Text>
                              <Text style={styles.cardBodyRowText} ellipsizeMode='tail' numberOfLines={2}>{item.source.join(', ')}</Text>
                            </View>
                            <View style={styles.cardBodyRow}>
                              <Text style={styles.cardBodyRowTitle}>Budget</Text>
                              <Text style={styles.cardBodyRowText} ellipsizeMode='tail' numberOfLines={1}>{item.budget}</Text>
                            </View>
                            <View style={styles.cardBodyRow}>
                              <Text style={styles.cardBodyRowTitle}>Status</Text>
                              <Text style={styles.cardBodyRowText}>{item.status}</Text>
                            </View>
                            <View style={styles.cardBodyRow}>
                              <Text style={styles.cardBodyRowTitle}>Next Reminder</Text>
                              <Text style={styles.cardBodyRowText}>{(item.scheduled_date !== null && item.scheduled_date !== '') ? moment(item.scheduled_date).format('DD/MM/YYYY') : item.scheduled_date}</Text>
                            </View>
                            <View style={styles.cardBodyRow}>
                              <Text style={styles.cardBodyRowTitle}>Remarks</Text>
                              <Text style={styles.cardBodyRowText} ellipsizeMode='tail' numberOfLines={3}>{item.remarks}</Text>
                            </View>
                            {group === 'admin' && <View style={[styles.cardBodyRow, { width: '80%' }]}>
                              <Text style={styles.cardBodyRowTitle}>Assigned To</Text>
                              <Text style={styles.cardBodyRowText} ellipsizeMode='tail' numberOfLines={1}>{item.SB_name}</Text>
                            </View>}
                          </View>
                        </View>
                      </TouchableNativeFeedback >
                      <TouchableNativeFeedback
                        onPress={() => setEditModalLead(item)}
                        background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
                      >
                        <View style={styles.editButton}>
                          <Text>Update</Text>
                          <View style={styles.emptySpace}></View>
                          <Feather name="edit" size={16} color="black" />
                        </View>
                      </TouchableNativeFeedback>
                    </View >
                  </>
                )
              }}
            />}
        {Object.keys(editModalLead).length > 0 && <Edit modalVisible={true} closeModal={closeEditModal} lead={editModalLead} />}
        {Object.keys(contactModalLead).length > 0 && <ContactModal modalVisible={true} closeModal={closeContactModal} lead={contactModalLead} />}
      </>}
    </ >
  )
}

const styles = StyleSheet.create({
  pageHeaderBar: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    marginBottom: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    flex: 1,
    marginRight: 10,
    height: 50,
    paddingHorizontal: 10,
    position: 'relative',
  },
  searchBar: {
    backgroundColor: '#ffffff',
    height: 50,
    paddingLeft: 10,
    width: '100%',
    fontSize: 18,
  },
  clearSearchIcon: {
    position: 'absolute',
    right: 10,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    position: 'relative',
    marginHorizontal: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 3,
  },
  cardHeading: {
    backgroundColor: styleConstants.primaryColor,
    paddingHorizontal: 10,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  },
  cardHeadingText: {
    color: '#ffffff',
    fontSize: 20,
  },
  cardBody: {
    padding: 15,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
    minHeight: 125,
    display: 'flex',
    justifyContent: 'center',
  },
  cardBodyRow: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 5,
  },
  cardBodyRowTitle: {
    width: 100,
    color: styleConstants.secondaryColor,
  },
  cardBodyRowText: {
    color: styleConstants.tertiaryTextColor,
    flex: 1,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 25,
    backgroundColor: styleConstants.tertiaryColor,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySpace: {
    width: 10,
  },
  moreButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    overflow: 'hidden',
  },
})

export default Leads