import { StyleSheet, Text, View, TouchableNativeFeedback, ScrollView, Platform } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { styleConstants } from '../../services/Constants'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import Edit from './Edit'
import ContactModal from './ContactModal'
import moment from 'moment'
import { contextData } from '../../context/DataContext'
import SplashScreen from './SplashScreen'

const About = ({ lead }) => {

  const { leadsTableData } = useContext(contextData)
  const [leadState, setLeadState] = useState(leadsTableData.filter(elem => elem.LID === lead.LID)[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  }

  const closeEditModal = () => {
    setEditModalVisible(false);
  }

  useEffect(() => {
    setLeadState(leadsTableData.filter(elem => elem.LID === lead.LID)[0]);
  }, [leadsTableData])

  // console.log(lead)

  return (
    <View>
      {loading ? <SplashScreen /> :
        <>
          <ScrollView>
            <View style={styles.profileCard}>
              <View style={styles.cardRow}>
                <Text style={styles.cardRowTitle}>Arrived On</Text>
                <Text style={styles.cardRowText}>{(leadState.lead_date !== null && leadState.lead_date !== '') ? moment(leadState.lead_date).format('DD/MM/YYYY hh:mm a') : leadState.lead_date}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardRowTitle}>Name</Text>
                <Text style={styles.cardRowText}>{leadState.full_name}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardRowTitle}>Phone</Text>
                <Text style={styles.cardRowText}>{leadState.phone}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardRowTitle}>Email</Text>
                <Text style={styles.cardRowText}>{leadState.email}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardRowTitle}>Address</Text>
                <Text style={styles.cardRowText}>{leadState.leadAddress}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardRowTitle}>City</Text>
                <Text style={styles.cardRowText}>{leadState.leadCity}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardRowTitle}>Source</Text>
                <Text style={styles.cardRowText}>{leadState.source.join(", ")}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardRowTitle}>Last Activity On</Text>
                <Text style={styles.cardRowText}>{(leadState.activity !== null && leadState.activity !== '') ? moment(leadState.activity).format('DD/MM/YYYY hh:mm a') : leadState.activity}</Text>
              </View>
            </View>
            <View style={styles.cardContainer}>
              <View style={styles.cardHeading}>
                <Text style={styles.cardHeadingText}>Next Reminder</Text>
                <TouchableNativeFeedback
                  onPress={() => setModalVisible(true)}
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
                  <Text style={styles.cardBodyRowText}>{(leadState.scheduled_date !== null && leadState.scheduled_date !== '') ? moment(leadState.scheduled_date).format('DD/MM/YYYY') : leadState.scheduled_date}</Text>
                </View>
                <View style={styles.cardBodyRow}>
                  <Text style={styles.cardBodyRowTitle}>Current Status</Text>
                  <Text style={styles.cardBodyRowText}>{leadState.status}</Text>
                </View>
                <View style={styles.cardBodyRow}>
                  <Text style={styles.cardBodyRowTitle}>Remarks</Text>
                  <Text style={styles.cardBodyRowText}>{leadState.remarks}</Text>
                </View>
              </View>
              <TouchableNativeFeedback
                onPress={() => setEditModalVisible(true)}
                background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : undefined}
              >
                <View style={styles.editButton}>
                  <Text>Update</Text>
                  <View style={styles.emptySpace}></View>
                  <Feather name="edit" size={16} color="black" />
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={styles.cardContainer}>
              <View style={styles.cardHeading}>
                <Text style={styles.cardHeadingText}>Preferences</Text>
              </View>
              <View style={styles.preferenceCardBody}>
                <View style={styles.cardBodyRow}>
                  <Text style={styles.cardBodyRowTitle}>Interested Location</Text>
                  <Text style={styles.cardBodyRowText}>{leadState.property_area}</Text>
                </View>
                <View style={styles.cardBodyRow}>
                  <Text style={styles.cardBodyRowTitle}>Interested Project</Text>
                  <Text style={styles.cardBodyRowText}>{leadState.interested_property}</Text>
                </View>
                <View style={styles.cardBodyRow}>
                  <Text style={styles.cardBodyRowTitle}>Configuration</Text>
                  <Text style={styles.cardBodyRowText}>{leadState.property_type}</Text>
                </View>
                <View style={styles.cardBodyRow}>
                  <Text style={styles.cardBodyRowTitle}>Deal Type</Text>
                  <Text style={styles.cardBodyRowText}>{leadState.deal_type}</Text>
                </View>
                <View style={styles.cardBodyRow}>
                  <Text style={styles.cardBodyRowTitle}>Budget</Text>
                  <Text style={styles.cardBodyRowText}>{leadState.budget}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
          <Edit modalVisible={editModalVisible} closeModal={closeEditModal} lead={leadState} />
          <ContactModal modalVisible={modalVisible} closeModal={closeModal} lead={leadState} />
        </>}
    </View>
  )
}

export default About

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    elevation: 3,
  },
  cardRow: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 5,
  },
  cardRowTitle: {
    color: styleConstants.secondaryColor,
    width: 125,
  },
  cardRowText: {
    color: styleConstants.tertiaryTextColor,
    flex: 1,
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
    // minHeight: 125,
    display: 'flex',
    justifyContent: 'center',
  },
  preferenceCardBody: {
    padding: 15,
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
  },
  cardBodyRow: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 5,
  },
  cardBodyRowTitle: {
    width: 125,
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