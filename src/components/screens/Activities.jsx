import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import moment from 'moment'
import { contextData } from '../../context/DataContext'
import { reminderStatusArray, styleConstants } from '../../services/Constants'

const Activities = ({ lead }) => {

  const { leadsTableData } = useContext(contextData)
  const [leadState, setLeadState] = useState(leadsTableData.filter(elem => elem.LID === lead.LID)[0]);

  useEffect(() => {
    setLeadState(leadsTableData.filter(elem => elem.LID === lead.LID)[0]);
  }, [leadsTableData])

  return (
    <View>
      <ScrollView>
        <View style={styles.mainContainer}>
          {leadState.history.map((item, index) => {
            return (
              <View key={index} style={styles.container}>
                {/* <ActivitiesCard /> */}
                <View style={styles.leftContainer}>
                  <View>
                    <Text>{(item.activity !== null && item.activity !== '') ? moment(item.activity).format('DD/MM/YYYY') : item.activity}</Text>
                  </View>
                  {index !== (leadState.history.length - 1) && <View style={styles.line}></View>}
                </View>
                <View style={styles.rightContainer}>
                  <View style={styles.textContainer}>
                    <Text style={styles.titleText}>Status<Text style={styles.dash}> - </Text><Text style={styles.text}>{item.status}</Text></Text>
                  </View>
                  {(item.reminder !== null && item.reminder !== '' && reminderStatusArray.includes(item.status)) && <View style={styles.textContainer}>
                    <Text style={styles.titleText}>Reminder Date<Text style={styles.dash}> - </Text><Text style={styles.text}>{(item.reminder !== null && item.reminder !== '') ? moment(item.reminder).format('DD/MM/YYYY') : item.reminder}</Text></Text>
                  </View>}
                  <View style={styles.textContainer}>
                    <Text style={styles.titleText}>Remarks<Text style={styles.dash}> - </Text><Text style={styles.text}>{item.remarks}</Text></Text>
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.titleText}>Activity By<Text style={styles.dash}> - </Text><Text style={styles.text}>{item.name}</Text></Text>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

export default Activities

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#ffffff',
    flex: 1,
    margin: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  container: {
    flexDirection: 'row',
  },
  leftContainer: {
    // flex: 0,
    alignItems: 'center',
  },
  line: {
    flex: 1,
    width: 2,
    minHeight: 125,
    backgroundColor: styleConstants.tertiaryTextColor,
    marginVertical: 5,
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginLeft: 10,
  },
  textContainer: {
    justifyContent: 'flex-start',
  },
  titleText: {
    color: styleConstants.secondaryColor,
  },
  dash: {
    color: '#000000',
  },
  text: {
    color: styleConstants.tertiaryTextColor,
  },
})