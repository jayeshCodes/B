import { FlatList, StyleSheet, Text, View, Dimensions, ScrollView, TouchableHighlight, Platform, ToastAndroid, RefreshControl } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { styleConstants } from '../../services/Constants'
import { LinearGradient } from 'expo-linear-gradient'
import { PieChart, LineChart } from 'react-native-chart-kit'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDown from '../utilities/DropDown'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment'
import SplashScreen from './SplashScreen'
import ListMenu from '../utilities/ListMenu'
import { contextData } from '../../context/DataContext'
import { api } from '../../services/Axios'
import { REACT_APP_API_URL } from "@env"

const initialPieChartData = [
  {
    // name: "Facebook",
    // count: 215,
    color: styleConstants.secondaryColor,
    legendFontColor: styleConstants.tertiaryTextColor,
    legendFontSize: 12.5
  },
  {
    // name: "Google",
    // count: 28,
    color: "#00C49F",
    legendFontColor: styleConstants.tertiaryTextColor,
    legendFontSize: 12.5
  },
  {
    // name: "MagicBricks",
    // count: 52,
    color: "#FFBB28",
    legendFontColor: styleConstants.tertiaryTextColor,
    legendFontSize: 12.5
  },
  {
    // name: "JustDial",
    // count: 85,
    color: "#00e6e6",
    legendFontColor: styleConstants.tertiaryTextColor,
    legendFontSize: 12.5
  },
  {
    // name: "Others",
    // count: 119,
    color: "#F27B86",
    legendFontColor: styleConstants.tertiaryTextColor,
    legendFontSize: 12.5
  }
];

const initialApiData = {
  sources: [],
  line_graph: {
    labels: [],
    datasets: [{
      data: [],
      color: () => styleConstants.tertiaryTextColor, // optional
      strokeWidth: 2, // optional
      fill: 'rgba(134, 65, 244, 0.2)'
    }]
    // legend: ["Rainy Days"] // optional
  }
}

const Dashboard = () => {

  const { dashboardFilters, dashboardFiltersCallback, subBrokers, group } = useContext(contextData);
  const [isFromDatePickerVisible, setFromDatePickerVisibility] = useState(false);
  const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const showDatePicker = (pickerName) => {
    pickerName === 'fromDatePicker' ? setFromDatePickerVisibility(true) : setToDatePickerVisibility(true);
  };

  const hideDatePicker = (pickerName) => {
    pickerName === 'fromDatePicker' ? setFromDatePickerVisibility(false) : setToDatePickerVisibility(false);
  };

  const handleConfirm = (date, pickerName) => {
    const newDate = date !== '' ? moment(new Date(date)).format('DD/MM/YYYY') : ''
    if (pickerName === 'fromDatePicker') {
      setFromDate(newDate);
      dashboardFiltersCallback((dashboardFilters) => ({ ...dashboardFilters, dateStart: newDate }));
    } else {
      setToDate(newDate);
      dashboardFiltersCallback((dashboardFilters) => ({ ...dashboardFilters, dateEnd: newDate }));
    }
    hideDatePicker(pickerName);
  };

  const selectEmployee = (item) => {
    dashboardFiltersCallback((dashboardFilters) => ({ ...dashboardFilters, employees: item }));
  }

  const applyFilters = async () => {
    try {
      setLoading(true);
      // console.log(dashboardFilters)
      const response = await api.post(`${process.env.REACT_APP_API_URL}/get_count`, dashboardFilters);
      // const res = await api.get(`${process.env.REACT_APP_API_URL}/get_line_graph`);
      // console.log(response.data)
      // console.log(res.data)
      response.data = {
        ...response.data,
        sources: response.data.sources.map((item, index) => {
          return { ...item, ...initialPieChartData[index] }
        }),
        line_graph: {
          labels: response.data.lineGraph.labels,
          datasets: [
            {
              data: response.data.lineGraph.data,
              color: () => styleConstants.tertiaryTextColor, // optional
              strokeWidth: 2, // optional
              fill: 'rgba(134, 65, 244, 0.2)'
            }
          ],
          // legend: ["Rainy Days"] // optional
        }
      }
      setApiData(response.data);
    } catch (err) {
      // console.log(err);
      // setError(err.message);
      ToastAndroid.show('Something went wrong, please try again later!', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  }

  const getDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${process.env.REACT_APP_API_URL}/get_count`);
      // const res = await api.get(`${process.env.REACT_APP_API_URL}/get_line_graph`);
      // console.log(response.data)
      // console.log(res.data)
      response.data = {
        ...response.data,
        sources: response.data.sources.map((item, index) => {
          return { ...item, ...initialPieChartData[index] }
        }),
        line_graph: {
          labels: response.data.lineGraph.labels,
          datasets: [
            {
              data: response.data.lineGraph.data,
              color: () => styleConstants.tertiaryTextColor, // optional
              strokeWidth: 2, // optional
              fill: 'rgba(134, 65, 244, 0.2)'
            }
          ],
          // legend: ["Rainy Days"] // optional
        }
      }
      setApiData(response.data);
    } catch (err) {
      // console.log(err)
      setError('Something went wrong, please try again later!');
      setApiData(initialApiData);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    applyFilters();
    setRefreshing(false);
  };

  useEffect(() => {
    getDashboardData();
  }, [])

  useEffect(() => {
    applyFilters();
  }, [dashboardFilters.dateStart, dashboardFilters.dateEnd])

  return (
    <>
      {(loading || !apiData) ? <SplashScreen /> :
        <ScrollView
          refreshControl={
            !error && <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[styleConstants.primaryColor]} />
          }
        >
          {error ?
            <View style={{ height: '100%', justifyContent: 'center' }}>
              <Text style={{ alignSelf: 'center' }}>Something went wrong, please try again later!</Text>
            </View>
            : <View>
              <View style={styles.buttonContainer}>
                <View style={[styles.buttonOuter, { width: group === 'admin' ? '31.5%' : '48.5%' }]}>
                  <TouchableHighlight
                    onPress={() => showDatePicker('fromDatePicker')}
                    background={Platform.OS === 'android' ? TouchableHighlight : undefined}
                  >
                    <View style={[styles.button, { backgroundColor: fromDate === '' ? styleConstants.screenBackgroundColor : styleConstants.primaryColor }]}>
                      <DateTimePickerModal
                        isVisible={isFromDatePickerVisible}
                        mode="date"
                        onConfirm={(date) => handleConfirm(date, 'fromDatePicker')}
                        onCancel={() => hideDatePicker('fromDatePicker')}
                        locale="en-IN"
                        maximumDate={toDate !== '' ? new Date(moment(toDate, 'DD/MM/YYYY').toDate()) : new Date()}
                      />
                      <Text style={[styles.buttonText, { color: fromDate === '' ? '#000000' : '#ffffff' }]}>{fromDate === '' ? 'From' : fromDate}</Text>
                      <MaterialCommunityIcons
                        name={fromDate === '' ? 'calendar-blank' : 'close-circle'}
                        color={fromDate === '' ? '#000000' : '#ffffff'}
                        size={20}
                        onPress={() => { fromDate !== '' ? handleConfirm('', 'fromDatePicker') : null }} />
                    </View>
                  </TouchableHighlight>
                </View>
                <View style={[styles.buttonOuter, { width: group === 'admin' ? '31.5%' : '48.5%' }]}>
                  <TouchableHighlight
                    onPress={() => showDatePicker('toDatePicker')}
                    background={Platform.OS === 'android' ? TouchableHighlight : undefined}
                  >
                    <View
                      style={[styles.button, { backgroundColor: toDate === '' ? styleConstants.screenBackgroundColor : styleConstants.primaryColor }]}
                      onPress={() => showDatePicker('toDatePicker')}>
                      <DateTimePickerModal
                        isVisible={isToDatePickerVisible}
                        mode="date"
                        onConfirm={(date) => handleConfirm(date, 'toDatePicker')}
                        onCancel={() => hideDatePicker('toDatePicker')}
                        locale="en-IN"
                        maximumDate={new Date()}
                        minimumDate={fromDate !== '' ? new Date(moment(fromDate, 'DD/MM/YYYY').toDate()) : undefined}
                      />
                      <Text style={[styles.buttonText, { color: toDate === '' ? '#000000' : '#ffffff' }]}>{toDate === '' ? 'To' : toDate}</Text>
                      <MaterialCommunityIcons
                        name={toDate === '' ? 'calendar-blank' : 'close-circle'}
                        color={toDate === '' ? '#000000' : '#ffffff'}
                        size={20}
                        onPress={() => { toDate !== '' ? handleConfirm('', 'toDatePicker') : null }} />
                    </View>
                  </TouchableHighlight>
                </View>
                {group === 'admin' && subBrokers.length > 0 &&
                  <ListMenu
                    mapArray={subBrokers}
                    onSelectHandler={selectEmployee}
                    onSelectOK={applyFilters}
                    dropListItems={dashboardFilters.employees}
                    defaultTitle="Select Employee"
                    width='31.5%'
                    nested={true}
                    primaryFieldName="SBID"
                    secondaryFieldName="name"
                    bgColor={dashboardFilters.employees.length > 0 ? styleConstants.primaryColor : styleConstants.screenBackgroundColor }
                    textColor={dashboardFilters.employees.length > 0 ? '#ffffff' : '#000000'}
                  />}
              </View>
              <View style={[styles.mainContainer, { backgroundColor: styleConstants.screenBackgroundColor }]}>
                <View style={styles.container}>
                  <FlatList
                    data={apiData.cardData}
                    keyExtractor={(item, index) => index}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => {
                      return (
                        <View style={[styles.cardOuter, { marginLeft: apiData.cardData[0] !== item ? 10 : 0 }]}>
                          <LinearGradient
                            colors={['rgba(255, 255, 255, 0.6)',
                              'rgba(212, 229, 253, 0.4656)',
                              'rgba(182, 210, 252, 0.3688)',
                              'rgba(162, 198, 252, 0.3054)',
                              'rgba(146, 188, 251, 0.2542)',
                              'rgba(108, 165, 250, 0.1356)',
                              'rgba(65, 139, 248, 0)',]}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0, y: 0 }}
                            style={styles.cardInner}
                          >
                            <Text style={styles.cardCount}>{item.value}</Text>
                          </LinearGradient>
                          <Text style={styles.headingText} ellipsizeMode='tail' numberOfLines={1}>{item.status}</Text>
                        </View>
                      )
                    }}
                    horizontal
                  />
                </View>
                <View style={styles.graphContainer}>
                  <Text style={styles.graphHeading}>Most Popular Sources</Text>
                  {apiData.sources.length > 0 ? <View>
                    <PieChart
                      data={apiData.sources}
                      width={Dimensions.get("window").width - 40}
                      height={200}
                      chartConfig={{
                        // backgroundGradientFrom: "#1E2923",
                        // backgroundGradientFromOpacity: 0,
                        // backgroundGradientTo: "#08130D",
                        // backgroundGradientToOpacity: 1,
                        color: () => '#000000',
                        propsForLabels: {
                          fontSize: 2,
                        },
                        // strokeWidth: 2, // optional, default 3
                        // barPercentage: 0.5,
                        // useShadowColorFromDataset: false // optional
                      }}
                      accessor={"value"}
                      backgroundColor={"transparent"}
                      // paddingLeft={"15"}
                      // center={[5, 0]}
                      // absolute
                      avoidFalseZero={true}
                    />
                  </View> : <View style={{ height: '100%', justifyContent: 'center' }}>
                    <Text style={{ alignSelf: 'center' }}>Not Enough Data</Text>
                  </View>}
                </View>
                <View style={[styles.graphContainer, { marginVertical: 10, height: 270 }]}>
                  <Text style={[styles.graphHeading, { marginBottom: 10 }]}>Recent Monthly Conversions</Text>
                  {apiData.line_graph.labels.length > 0 ? <LineChart
                    data={apiData.line_graph}
                    width={Dimensions.get("window").width - 70}
                    height={225}
                    // verticalLabelRotation={30}
                    style={{ paddingLeft: 30 }}
                    withInnerLines={false}
                    withOuterLines={false}
                    yLabelsOffset={20}
                    fromZero={true}
                    formatYLabel={(value) => `${Math.abs(value)}`}
                    chartConfig={{
                      backgroundGradientFrom: "#ffffff",
                      backgroundGradientFromOpacity: 0,
                      backgroundGradientTo: "#ffffff",
                      backgroundGradientToOpacity: 1,
                      backgroundColor: "#ffffff",
                      color: () => '#000000',
                      labelColor: () => styleConstants.tertiaryTextColor,
                      legendPosition: 'bottom',
                      // strokeWidth: 2, // optional, default 3
                      // barPercentage: 0.5,
                      // useShadowColorFromDataset: false // optional
                    }}
                    bezier
                  /> : <View style={{ height: '100%', justifyContent: 'center' }}>
                    <Text style={{ alignSelf: 'center' }}>Not Enough Data</Text>
                  </View>}
                </View>
              </View>
            </View>}
        </ScrollView>}
    </>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 10
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardOuter: {
    width: 175,
    height: 225,
    paddingTop: 10,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: styleConstants.primaryColor,
    elevation: 3,
  },
  cardInner: {
    marginTop: 15,
    height: 150,
    width: '75%',
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  cardCount: {
    fontSize: 40,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headingText: {
    fontSize: 15,
    color: '#ffffff',
    flex: 1,
    marginTop: 15,
    textAlign: 'center',
  },
  graphContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  graphHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: styleConstants.primaryColor,
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
})