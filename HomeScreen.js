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
      keys:[],
    };
  }

  componentDidMount() {
    this.clean();
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

  updateData = async (key,data) => {
    try {
      await AsyncStorage.setItem(
        key,
        data,
      );
    } catch (error) {
      console.error(error)
    }
  }


  importData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log(keys)
      if (keys.length === 0) {
        return;
      }
  
      const fetchedData = [];
  
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        const parsedJSON = JSON.parse(value);
  
        fetchedData.push({
          start: parsedJSON.start,
          end: parsedJSON.end,
          name: parsedJSON.name,
          description: parsedJSON.description,
          height: parsedJSON.height,
           // Math.max(50, Math.floor(Math.random() * 150)),
          completed: parsedJSON.completed,
          date:parsedJSON.date,
          key:key,
        });
      }
  
      this.setState({ fetchedData });
    } catch (error) {
      console.error(error);
    }
  };


  
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

  createCompletness = (reservation) =>{
  Alert.alert('Is this event completed?', reservation.name, [
    {
      text: 'Close',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {text: 'Completed', onPress: () => {
      reservation.completed = true
      this.updateData(reservation.key,reservation)
    }},
  ]);
  console.log(reservation);
  }

  loadItems = (day) => {
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
      onPress={() => this.createCompletness(reservation)} 
      style={{
        width: '95%',
        height: reservation.height,
        marginBottom:10,
        marginTop:5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
      }}>
        {this.parseBody(reservation)}
        <Text style={cssTime}>{reservation.start} - {reservation.end}</Text>
        <Text style={cssName}>{reservation.name}</Text>
        <Text style={cssDescription}>{reservation.description}</Text>  
    </TouchableOpacity>

    );
  }

  parseBody = (reservation) => {
    console.log(reservation.completed)
    if(reservation.completed){
      return(
      <View
      style={{
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        right: 10,
        top: 10,
      }}>
      <View
      style={{
        position: 'absolute',
        width: 120,
        height: 45,
        backgroundColor: 'green',
        transform: [{rotate: '45deg'}],
      }}
    />
    <Text style={{color: 'white', fontSize: 15, fontWeight: 'bold'}}>
      ✓
    </Text>
    </View>
      );
    }else{
      return(
        <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          right: 10,
          top: 10,
        }}>
        <View
        style={{
          position: 'absolute',
          width: 120,
          height: 45,
          backgroundColor: 'red',
          transform: [{rotate: '45deg'}],
        }}
      />
      <Text style={{color: 'white', fontSize: 15, fontWeight: 'bold'}}>
        X
      </Text>
      </View>
      );
    }
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
