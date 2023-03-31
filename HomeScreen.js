import React, {Component} from 'react';
import {Alert, Modal,StyleSheet, Text, Button, View, TouchableOpacity, TextInput} from 'react-native';
import {Agenda} from 'react-native-calendars';
import testIDs from './dataSet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionButton from 'react-native-action-button';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: undefined,
      today:new Date(),
      fetchedData:[],
    };
  }

  componentDidMount() {
    this.importData();
    //this.getData();
  }

  getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        this.setState({ storedValue: value });
      }
    } catch (e) {
      console.log('Error reading value from AsyncStorage');
    }
  };

  clean = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error(error)
    }
  }


  importData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      if (keys.length === 0) {
        return;
      }
  
      const fetchedData = [];
  
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        const parsedJSON = JSON.parse(value);
  
        fetchedData.push({
          start: `${parsedJSON.fromHourTime}:${parsedJSON.fromMinuteTime < 10 ? '0' : ''}${parsedJSON.fromMinuteTime}`,
          end: `${parsedJSON.toHourTime}:${parsedJSON.toMinuteTime < 10 ? '0' : ''}${parsedJSON.toMinuteTime}`,
          name: parsedJSON.name,
          description: parsedJSON.description,
          height: this.generateHeight(parsedJSON.fromHourTime, parsedJSON.fromMinuteTime,parsedJSON.toHourTime,parsedJSON.toMinuteTime),
           // Math.max(50, Math.floor(Math.random() * 150)),
          completed: parsedJSON.completed!=undefined ? parsedJSON.completed : false,
          date:parsedJSON.date 
        });
      }
  
      this.setState({ fetchedData });
    } catch (error) {
      console.error(error);
    }
  };

  generateHeight = (sHour, sMinute, eHour, eMinute) => {    
    sMinute = sMinute < 10 ? '0'+sMinute : sMinute
    eMinute = sMinute < 10 ? '0'+eMinute : eMinute
    startTime = parseInt(''+sHour+''+sMinute);
    endTime = parseInt(''+eHour+''+eMinute);
    return endTime - startTime;
  }
  
  render() {
    return (
      <SafeAreaProvider style={{flex:1}}>        
      <Agenda
        testID={testIDs.agenda.CONTAINER}
        items={this.state.items}
        loadItemsForMonth={this.loadItems}
        selected={this.state.today}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
        rowHasChanged={this.rowHasChanged}
        showClosingKnob={true}
        //markingType={'period'}
        //markedDates={{
        //    '2017-05-08': {textColor: '#43515c'},
        //    '2017-05-09': {textColor: '#43515c'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
         //   '2023-05-26': {endingDay: true, color: 'gray'}}}
        monthFormat={'MMMM' + ' - '+'yyyy'}
        //theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
        // hideExtraDays={false}
        // showOnlySelectedDayItems
        reservationsKeyExtractor={this.reservationsKeyExtractor}
      />
        <ActionButton 
        useNativeDriver={false} 
        onPress={() => this.props.navigation.navigate('Add')}
        />
      </SafeAreaProvider>
    );
  }

  reservationsKeyExtractor = (item, index) => {
    return `${item?.reservation?.day}${index}`;
 };

  loadData = (day) =>{   
    setTimeout(() => {this.importData(day);}, 1000);
  }

  loadItems = (day) => {
    //console.log(this.state.fetchedData)
    const items = {};

    setTimeout(() => {
      for (data of this.state.fetchedData){
        var ourDate = this.parseDateIntoStringAndVice(data.date);
        if (!items[ourDate]) {
          items[ourDate] = [];        
        }  
          items[ourDate].push({
            start: data.start,
            end: data.end,
            name: data.name,
            description:data.description,
            height: data.height, // Math.max(50, Math.floor(Math.random() * 150)),
            day: ourDate,
            completed: data.completed
          });
      }      
      const newItems = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });
      this.setState({
        items: newItems
      });
    }, 1000);
  }

  renderItem = (reservation, isFirst) => {

    let cssTime = styles.time;
    let cssName = styles.name;
    let cssDescription = styles.description;

    if (!isFirst) {
      cssTime = styles.timeCancelled;
      cssName = styles.nameCancelled;
      cssDescription = styles.descriptionCancelled;
    }

    return (
      <TouchableOpacity
      testID={testIDs.agenda.ITEM}
      style={[styles.item, {height: reservation.height}]}
      onPress={() => Alert.alert(reservation.name)}>
        <Text style={cssTime}>{reservation.start} - {reservation.end}</Text>
        <Text style={cssName}>{reservation.name}</Text>
        <Text style={cssDescription}>{reservation.description}</Text>        
      </TouchableOpacity>
    );
  }

  parseDateIntoStringAndVice = (data) => {
    const date = new Date(data);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return formattedDate
  }

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  time:{
    fontSize:18,
    color:'black'
  },
  name:{
    fontSize:16,
    color:'black'
  },
  description:{
    fontSize:14,
    color:'black'
  },
  timeCancelled:{
    fontSize:18,
    color:'grey'
  },
  nameCancelled:{
    fontSize:16,
    color:'grey'
  },
  descriptionCancelled:{
    fontSize:14,
    color:'grey'
  }  
});
