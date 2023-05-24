import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DropDown from '../utilities/DropDown.jsx';
import RecordCard from '../utilities/RecordCard'
import { styleConstants } from '../../services/Constants.js';

const Recordings = () => {
  

    const selectOption = (item) => {
      // console.log(item);
    }
  

  const data=["Today", "Yesterday", "This Week"]

  return (
    <View>
      <View style={{flexDirection:'column' , height:51, backgroundColor:'#ffffff'}}>
        <View>
          <Text
          style={{ marginLeft:10}}>Call Recordings</Text>
        </View>
        <View style={{position:'absolute', height:'50%', marginLeft:300}}>
        <DropDown dropListItems={['Daily', 'Weekly', 'Monthly']} onSelectHandler={selectOption} />
        </View>
      </View>
      <View style={styles.filter}>
      </View>
      <View style={styles.content}>
        <RecordCard />
      </View>
    </View>
  )
}

const styles= StyleSheet.create({
  content:{
    alignItems:'center',
    justifyContent:'center'
  },
  filter:{
    backgroundColor: styleConstants.screenBackgroundColor,
    height:43
  }
})

export default Recordings

