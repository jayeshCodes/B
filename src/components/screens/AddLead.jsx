import { StyleSheet, Text, View, TouchableNativeFeedback, Platform, ScrollView, TextInput, ToastAndroid } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { dealTypesArray, propertyTypesArray, statusArray, reminderStatusArray, styleConstants } from '../../services/Constants'
import DropDown from '../utilities/DropDown'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'
import SourceDropdown from '../utilities/SourceDropdown'
import { contextData } from '../../context/DataContext'
import SplashScreen from './SplashScreen'
import { sourceArray } from '../../services/Constants'
import { REACT_APP_API_URL } from '@env'
import { api } from '../../services/Axios'

const initial = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  dealType: "",
  interestedAreas: "",
  interestedProperties: "",
  propertyType: "",
  budget: "",
  source: [],
  brokerSource: "",
  brokerSourceName: "",
  status: "Incoming",
  reminderDate: "",
  remarks: "",
  assignTo: "",
  assignToTitle: ""
}

const initialAlert = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dealType: "",
  propertyType: "",
  budget: "",
  source: "",
  reminderDate: ""
}

const AddLead = ({ navigation, route }) => {

  const [show, setShow] = useState(false);
  const { subBrokersActive, group, leadsTableDataCallback, tasksDataCallback, filterObject, projectsCallback } = useContext(contextData);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState(initial);
  const [sourceTitle, setSourceTitle] = useState("Select Sources");
  const [alert, setAlert] = useState(initialAlert);
  const [scrollPosition, setScrollPosition] = useState(0);

  // console.log("credentials", credentials)

  const setSource = (value) => {
    setCredentials((prev) => ({ ...prev, source: value }));
  }

  const handleOptionChange = (value1, value2) => {
    if (credentials.brokerSource !== value1 && credentials.brokerSourceName !== value2) {
      setCredentials((prev) => ({ ...prev, brokerSource: value1 }));
      setCredentials((prev) => ({ ...prev, brokerSourceName: value2 }));
    } else {
      setCredentials((prev) => ({ ...prev, brokerSource: "" }));
      setCredentials((prev) => ({ ...prev, brokerSourceName: "" }));
    }
  }

  const isFilterOn = () => {
    if (filterObject.sortOrder !== "Date (Latest First)" || filterObject.dateStart !== "" || filterObject.dateEnd !== "" || filterObject.names.length !== 0 || filterObject.mobiles.length !== 0 || filterObject.source.length !== 0 || filterObject.brokerSources.length !== 0 || filterObject.propertyNames.length !== 0 || filterObject.propertyAreas.length !== 0 || filterObject.propertyTypes.length !== 0 || filterObject.dealTypes.length !== 0 || filterObject.statuses.length !== 0 || filterObject.calenderDate !== "" || filterObject.assignedTo.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

  // const nullFunction = () => {
  //   return;
  // }

  const handleSave = async () => {
    setLoading(true);
    if (validateForm()) {
      try {
        const res = await api.post(`${process.env.REACT_APP_API_URL}/send_data`, credentials)
        if (!res.data.properties) {
          ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
        } else {
          projectsCallback(res.data.properties);
          setCredentials(initial);
          setSourceTitle("Select Sources");
          setAlert(initialAlert);
          try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/get?table=leads`);
            leadsTableDataCallback(response.data);
            const respo = await api.get(`${process.env.REACT_APP_API_URL}/get_pending_leads`)
            tasksDataCallback(respo.data);
            if (isFilterOn()) {
              const resp = await api.post(`${process.env.REACT_APP_API_URL}/filter`, filterObject);
              filteredLeadsCallback(resp.data);
            }
          } catch (err) {
            // console.log(err);
          }
          ToastAndroid.show('Lead added successfully!', ToastAndroid.SHORT);
        }
      } catch (err) {
        // console.log(err);
        ToastAndroid.show('Something went wrong, please try again later!', ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }

  const handleReset = () => {
    setCredentials(initial);
    setSourceTitle("Select Sources");
    setAlert(initialAlert);
  }

  const validateForm = () => {
    let flag = false;
    if (credentials.firstName === "") {
      setAlert((prev) => ({ ...prev, firstName: "First Name is required" }));
      flag = true;
    }
    if (credentials.lastName === "") {
      setAlert((prev) => ({ ...prev, lastName: "Last Name is required" }));
      flag = true;
    }
    if (/\s/.test(credentials.lastName)) {
      setAlert((prev) => ({ ...prev, lastName: "Last Name cannot contain spaces" }));
      flag = true;
    }
    if (credentials.email && !(/^\w+([\.-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(credentials.email))) {
      setAlert((prev) => ({ ...prev, email: "Please enter a valid email address" }));
      flag = true;
    }
    if (credentials.phone.match(/^[0-9]{10}$/) === null) {
      setAlert((prev) => ({ ...prev, phone: "Please enter a valid 10 digit phone number" }));
      flag = true;
    }
    if (credentials.phone === "") {
      setAlert((prev) => ({ ...prev, phone: "Phone is required" }));
      flag = true;
    }
    if (credentials.dealType === "") {
      setAlert((prev) => ({ ...prev, dealType: "Deal Type is required" }));
      flag = true;
    }
    if (credentials.propertyType === "") {
      setAlert((prev) => ({ ...prev, propertyType: "Configuration is required" }));
      flag = true;
    }
    if (credentials.source.length === 0 && credentials.brokerSource === "") {
      setAlert((prev) => ({ ...prev, source: "Source is required" }));
      flag = true;
    }
    if (reminderStatusArray.includes(credentials.status) && credentials.reminderDate === "") {
      setAlert((prev) => ({ ...prev, reminderDate: "Reminder Date is required" }));
      flag = true;
    }
    if (flag) {
      return false;
    } else {
      return true;
    }
  }

  useEffect(() => {
    if (route.params?.selectedProject) {
      setCredentials((prev) => ({ ...prev, interestedProperties: route.params.selectedProject }));
    }
  }, [route.params?.selectedProject]);

  useEffect(() => {
    if (credentials.brokerSource !== "" && credentials.source.length > 0) {
      setSourceTitle(credentials.source.join(", ") + ", " + credentials.brokerSourceName);
    } else if (credentials.brokerSource === "" && credentials.source.length > 0) {
      setSourceTitle(credentials.source.join(", "));
    } else if (credentials.brokerSource !== "" && credentials.source.length === 0) {
      setSourceTitle(credentials.brokerSourceName);
    } else {
      setSourceTitle("Select Source");
    }
  }, [credentials.source, credentials.brokerSource]);

  useEffect(() => {
    if (credentials.firstName !== "") {
      setAlert((prev) => ({ ...prev, firstName: "" }));
    }
    if (credentials.lastName !== "") {
      setAlert((prev) => ({ ...prev, lastName: "" }));
    }
    if (!(/\s/.test(credentials.lastName))) {
      setAlert((prev) => ({ ...prev, lastName: "" }));
    }
    if (credentials.email && /^\w+([\.-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(credentials.email)) {
      setAlert((prev) => ({ ...prev, email: "" }));
    }
    if (credentials.email !== "") {
      setAlert((prev) => ({ ...prev, email: "" }));
    }
    if (credentials.phone.match(/^[0-9]{10}$/) !== null) {
      setAlert((prev) => ({ ...prev, phone: "" }));
    }
    if (credentials.phone !== "") {
      setAlert((prev) => ({ ...prev, phone: "" }));
    }
    if (credentials.dealType !== "") {
      setAlert((prev) => ({ ...prev, dealType: "" }));
    }
    if (credentials.propertyType !== "") {
      setAlert((prev) => ({ ...prev, propertyType: "" }));
    }
    if (credentials.source.length !== 0 || credentials.brokerSource !== "") {
      setAlert((prev) => ({ ...prev, source: "" }));
    }
    if (reminderStatusArray.includes(credentials.status) && credentials.reminderDate !== "") {
      setAlert((prev) => ({ ...prev, reminderDate: "" }));
    }
  }, [credentials.firstName, credentials.lastName, credentials.email, credentials.phone, credentials.dealType, credentials.propertyType, credentials.source, credentials.brokerSource, credentials.status, credentials.reminderDate]);

  return (
    <View>
      {loading ? <SplashScreen /> :
        <ScrollView style={styles.mainContainer}>
          <View style={styles.rowContainer}>
            <Text style={styles.rowTitle}>First Name <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              cursorColor={styleConstants.primaryColor}
              onChangeText={(text) => setCredentials((credentials) => ({ ...credentials, firstName: text }))}
              style={styles.textInput}
              value={credentials.firstName}
            />
            {alert.firstName && <View>
              <Text style={styles.warningText}>{alert.firstName}</Text>
            </View>}
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.rowTitle}>Last Name <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              cursorColor={styleConstants.primaryColor}
              onChangeText={(text) => setCredentials((credentials) => ({ ...credentials, lastName: text }))}
              style={styles.textInput}
              value={credentials.lastName}
            />
            {alert.lastName && <View>
              <Text style={styles.warningText}>{alert.lastName}</Text>
            </View>}
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.rowTitle}>Email</Text>
            <TextInput
              cursorColor={styleConstants.primaryColor}
              keyboardType='email-address'
              onChangeText={(text) => setCredentials((credentials) => ({ ...credentials, email: text }))}
              style={styles.textInput}
              value={credentials.email}
            />
            {alert.email && <View>
              <Text style={styles.warningText}>{alert.email}</Text>
            </View>}
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.rowTitle}>Phone <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              cursorColor={styleConstants.primaryColor}
              keyboardType='phone-pad'
              onChangeText={(text) => setCredentials((credentials) => ({ ...credentials, phone: text }))}
              style={styles.textInput}
              value={credentials.phone}
            />
            {alert.phone && <View>
              <Text style={styles.warningText}>{alert.phone}</Text>
            </View>}
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.rowTitle}>Address</Text>
            <TextInput
              cursorColor={styleConstants.primaryColor}
              onChangeText={(text) => setCredentials((credentials) => ({ ...credentials, address: text }))}
              style={styles.textInput}
              value={credentials.address}
            />
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.rowTitle}>City</Text>
            <TextInput
              cursorColor={styleConstants.primaryColor}
              onChangeText={(text) => setCredentials((credentials) => ({ ...credentials, city: text }))}
              style={styles.textInput}
              value={credentials.city}
            />
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.rowTitle}>Deal Type <Text style={{ color: 'red' }}>*</Text></Text>
            <DropDown
              dropListItems={dealTypesArray}
              defaultValue={credentials.dealType}
              onSelectHandler={(text) => setCredentials((credentials) => ({ ...credentials, dealType: text }))}
              width='100%'
              bgColor={styleConstants.screenBackgroundColor}
            />
            {alert.dealType && <View>
              <Text style={styles.warningText}>{alert.dealType}</Text>
            </View>}
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.rowTitle}>Interested Configuration <Text style={{ color: 'red' }}>*</Text></Text>
            <DropDown
              dropListItems={propertyTypesArray}
              defaultValue={credentials.propertyType}
              onSelectHandler={(text) => setCredentials((credentials) => ({ ...credentials, propertyType: text }))}
              width='100%'
              bgColor={styleConstants.screenBackgroundColor}
            />
            {alert.propertyType && <View>
              <Text style={styles.warningText}>{alert.propertyType}</Text>
            </View>}
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.rowTitle}>Interested Location</Text>
            <TextInput
              cursorColor={styleConstants.primaryColor}
              onChangeText={(text) => setCredentials((credentials) => ({ ...credentials, interestedAreas: text }))}
              style={styles.textInput}
              value={credentials.interestedAreas}
            />
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.rowTitle}>Project Name</Text>
            {/* <TextInput
              cursorColor={styleConstants.primaryColor}
              onChangeText={(text) => setCredentials((credentials) => ({ ...credentials, interestedProperties: text }))}
              style={styles.textInput}
              value={credentials.interestedProperties}
            /> */}
            <View style={styles.mainButtonContainer}>
              <TouchableNativeFeedback
                onPress={() => navigation.navigate('Search Screen', { initialValue: credentials.interestedProperties })}
                background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
              >
                <View style={styles.mainButton}>
                  <Text style={{ flex: 1, textAlignVertical: 'center' }} ellipsizeMode='tail' numberOfLines={1}>{credentials.interestedProperties}</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.rowTitle}>Budget</Text>
            <TextInput
              cursorColor={styleConstants.primaryColor}
              keyboardType='number-pad'
              onChangeText={(text) => setCredentials((credentials) => ({ ...credentials, budget: text }))}
              style={styles.textInput}
              value={credentials.budget}
            />
            {alert.budget && <View>
              <Text style={styles.warningText}>{alert.budget}</Text>
            </View>}
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.rowTitle}>Source <Text style={{ color: 'red' }}>*</Text></Text>
            <SourceDropdown
              selectedSources={credentials.source}
              selectedBrokerSources={credentials.brokerSource}
              onSelectSources={setSource}
              onSelectBrokerSources={handleOptionChange}
              fieldTitle={sourceTitle}
              width='100%'
              bgColor={styleConstants.screenBackgroundColor}
              textColor='#000000'
            />
            {alert.source && <View>
              <Text style={styles.warningText}>{alert.source}</Text>
            </View>}
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.rowTitle}>Status</Text>
            <DropDown
              dropListItems={statusArray}
              defaultValue={credentials.status}
              onSelectHandler={(text) => setCredentials((credentials) => ({ ...credentials, status: text }))}
              width='100%'
              bgColor={styleConstants.screenBackgroundColor}
            />
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.rowTitle}>Next Reminder Date {reminderStatusArray.includes(credentials.status) && <Text style={{ color: 'red' }}>*</Text>}</Text>
            <View style={styles.dateButtonOuter}>
              <TouchableNativeFeedback
                onPress={() => reminderStatusArray.includes(credentials.status) ? setShow(true) : null}
                background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
              >
                <View style={styles.button}>
                  <DateTimePickerModal
                    isVisible={show}
                    mode="date"
                    onConfirm={(date) => { setShow(false); setCredentials((credentials) => ({ ...credentials, reminderDate: date !== '' ? moment(new Date(date)).format('DD/MM/YYYY') : '' })) }}
                    onCancel={() => setShow(false)}
                    locale="en-IN"
                    minimumDate={new Date()}
                  />
                  <Text style={{ color: reminderStatusArray.includes(credentials.status) ? '#000000' : styleConstants.tertiaryTextColor }}>{credentials.reminderDate === '' ? 'Select Reminder Date' : credentials.reminderDate}</Text>
                  <MaterialCommunityIcons
                    name={credentials.reminderDate === '' ? 'calendar-blank' : 'close-circle'}
                    color={reminderStatusArray.includes(credentials.status) ? '#000000' : styleConstants.tertiaryTextColor}
                    size={20}
                    onPress={credentials.reminderDate !== '' ? () => { setCredentials((credentials) => ({ ...credentials, reminderDate: '' })) } : null}
                  />
                </View>
              </TouchableNativeFeedback>
            </View>
            {alert.reminderDate && <View>
              <Text style={styles.warningText}>{alert.reminderDate}</Text>
            </View>}
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.rowTitle}>Remarks</Text>
            <TextInput
              cursorColor={styleConstants.primaryColor}
              multiline={true}
              numberOfLines={3}
              onChangeText={(text) => setCredentials((credentials) => ({ ...credentials, remarks: text }))}
              style={styles.textInput}
              value={credentials.remarks}
            />
          </View>
          {group === 'admin' && <View style={styles.rowContainer}>
            <Text style={styles.rowTitle}>Assign To</Text>
            <DropDown
              dropListItems={subBrokersActive}
              defaultValue={credentials.assignTo !== '' ? subBrokersActive.filter((item) => item.SBID === credentials.assignTo)[0].name : credentials.assignTo}
              onSelectHandler={(text) => setCredentials((credentials) => ({ ...credentials, assignTo: text }))}
              width='100%'
              bgColor={styleConstants.screenBackgroundColor}
              nested={true}
              primaryFieldName='SBID'
              secondaryFieldName='name'
            />
          </View>}
          <View style={[styles.buttonOuter, { marginBottom: 10, marginTop: 20 }]}>
            <TouchableNativeFeedback
              onPress={() => handleReset()}
              background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
            >
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Reset</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
          <View style={[styles.buttonOuter, { marginBottom: 40 }]}>
            <TouchableNativeFeedback
              onPress={() => handleSave()}
              background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
            >
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Save</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </ScrollView>}
    </View>
  )
}

export default AddLead

const styles = StyleSheet.create({
  mainContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  rowContainer: {
    marginBottom: 20,
  },
  rowTitle: {
    marginBottom: 5,
  },
  textInput: {
    width: '100%',
    height: 50,
    backgroundColor: styleConstants.screenBackgroundColor,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  mainButtonContainer: {
    borderRadius: 5,
    overflow: 'hidden',
    height: 50,
    width: '100%',
  },
  mainButton: {
    width: '100%',
    height: '100%',
    backgroundColor: styleConstants.screenBackgroundColor,
    paddingHorizontal: 10,
  },
  buttonOuter: {
    borderRadius: 5,
    overflow: 'hidden',
    width: '100%',
    height: 50,
    backgroundColor: styleConstants.primaryColor,
    elevation: 3,
  },
  buttonContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
  },
  dateButtonOuter: {
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
  warningText: {
    color: 'red',
    fontStyle: 'italic',
  },
})