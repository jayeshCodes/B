import { StyleSheet, Text, View, Pressable, ScrollView, TouchableNativeFeedback, Platform, RefreshControl } from 'react-native'
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons'
import React, { useState, useEffect, useContext } from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import moment from 'moment'
import { styleConstants } from '../../services/Constants'
import Edit from './Edit'
import ContactModal from './ContactModal'
import SplashScreen from './SplashScreen'
import { contextData } from '../../context/DataContext'
import { REACT_APP_API_URL } from '@env'
import { api } from '../../services/Axios'

const Reminders = ({ navigation }) => {

  const { tasksDataCallback, tasksData } = useContext(contextData)
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [reminderDate, setReminderDate] = useState(moment(new Date()).format('DD/MM/YYYY'));
  const [currentCards, setCurrentCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEditItem, setSelectedEditItem] = useState({});
  const [selectedContactItem, setSelectedContactItem] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const closeContactModal = () => {
    setSelectedContactItem({});
  }

  const closeEditModal = () => {
    setSelectedEditItem({});
  }

  const handleConfirm = (date) => {
    setReminderDate(moment(new Date(date)).format('DD/MM/YYYY'));
    setDatePickerVisibility(false);
  };

  const updateReminderDate = (method) => {
    method === 'add' ? setReminderDate(moment(reminderDate, 'DD/MM/YYYY').add(1, 'days').format('DD/MM/YYYY')) : setReminderDate(moment(reminderDate, 'DD/MM/YYYY').subtract(1, 'days').format('DD/MM/YYYY'));
  }

  const getData = () => {
    setLoading(true);
    api.get(`${process.env.REACT_APP_API_URL}/get_pending_leads`)
      .then((res) => {
        tasksDataCallback(res.data);
        // console.log(res.data)
        const filteredData = res.data.filter((lead) => {
          return lead.status !== 'Incoming' ? moment(lead.scheduled_date).format('DD/MM/YYYY') === reminderDate : moment(lead.lead_date).format('DD/MM/YYYY') === reminderDate;
        })
        setCurrentCards(filteredData);
      })
      .catch((err) => {
        // console.log(err);
        setError('Something went wrong, please try again later!');
      })
      .finally(() => {
        setLoading(false);
      })
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    getData();
  }, [])

  useEffect(() => {
    const filteredData = tasksData.filter((lead) => {
      return lead.status !== 'Incoming' ? moment(lead.scheduled_date).format('DD/MM/YYYY') === reminderDate : moment(lead.lead_date).format('DD/MM/YYYY') === reminderDate;
    })
    setCurrentCards(filteredData);
  }, [reminderDate, tasksData])

  // console.log(currentCards)

  return (
    <>
      {loading ? <SplashScreen /> :
        error ? <Text style={{ textAlign: 'center' }}>{error}</Text> :
          <>
            <View style={styles.pageHeaderBar}>
              <View style={styles.calendarButton}>
                <View style={styles.addSubtractDateButtonContainer}>
                  <TouchableNativeFeedback
                    background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
                    onPress={() => updateReminderDate('subtract')}
                  >
                    <View style={styles.addSubtractDateButton}>
                      <AntDesign name="left" size={24} color={styleConstants.secondaryColor} />
                    </View>
                  </TouchableNativeFeedback>
                </View>
                <Pressable
                  style={styles.calendarDateContainer}
                  onPress={() => setDatePickerVisibility(true)}>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={(date) => handleConfirm(date)}
                    onCancel={() => setDatePickerVisibility(false)}
                    locale="en-IN"
                  />
                  <Text>
                    {(moment(reminderDate, 'DD/MM/YYYY').startOf('day').isSame(moment().startOf('day'))) ? 'Today' : moment(reminderDate, 'DD/MM/YYYY').format('DD MMM, YYYY')}
                  </Text>
                </Pressable>
                <View style={styles.addSubtractDateButtonContainer}>
                  <TouchableNativeFeedback
                    background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
                    onPress={() => updateReminderDate('add')}
                  >
                    <View style={styles.addSubtractDateButton}>
                      <AntDesign name="right" size={24} color={styleConstants.secondaryColor} />
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </View>
            </View>
            {currentCards.length > 0 ?
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[styleConstants.primaryColor]} />
              }
            >
              {currentCards.map((item, index) => {
                return (
                  <View key={index} style={[styles.cardContainer, { marginTop: index === 0 ? 10 : 0 }]}>
                    <TouchableNativeFeedback
                      onPress={() => navigation.navigate('LeadProfileNavigator', { data: item })}
                      background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
                      useForeground={true}
                    >
                      <View>
                        <View style={styles.cardHeading}>
                          <Text style={styles.cardHeadingText}>{item.full_name}</Text>
                          <TouchableNativeFeedback
                            onPress={() => setSelectedContactItem(item)}
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
                            <Text style={styles.cardBodyRowTitle}>Status</Text>
                            <Text style={styles.cardBodyRowText}>{item.status}</Text>
                          </View>
                          <View style={styles.cardBodyRow}>
                            <Text style={styles.cardBodyRowTitle}>Remarks</Text>
                            <Text style={[styles.cardBodyRowText, { flex: 1 }]} ellipsizeMode='tail' numberOfLines={3}>{item.remarks}</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                      onPress={() => setSelectedEditItem(item)}
                      background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
                    >
                      <View style={styles.editButton}>
                        <Text>Update</Text>
                        <View style={styles.emptySpace}></View>
                        <Feather name="edit" size={16} color="black" />
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                )
              })}
            </ScrollView>
              :
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ alignSelf: 'center' }}>{`No reminders for ${moment(reminderDate, 'DD/MM/YYYY').startOf('day').isSame(moment().startOf('day')) ? 'today' : reminderDate}!`}</Text>
              </View>}
            {Object.keys(selectedEditItem).length > 0 && <Edit modalVisible={true} closeModal={closeEditModal} lead={selectedEditItem} />}
            {Object.keys(selectedContactItem).length > 0 && <ContactModal modalVisible={true} closeModal={closeContactModal} lead={selectedContactItem} />}
          </>}
    </>
  )
}

export default Reminders

const styles = StyleSheet.create({
  pageHeaderBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    // marginBottom: 10,
  },
  calendarButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  calendarDateContainer: {
    width: '40%',
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSubtractDateButtonContainer: {
    width: 50,
    height: 50,
    borderRadius: 100,
    overflow: 'hidden',
  },
  addSubtractDateButton: {
    width: 50,
    height: 50,
    display: 'flex',
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