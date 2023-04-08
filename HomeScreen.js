import React, {Component} from 'react';
import {Alert, Modal,StyleSheet, Text,  Animated, Easing, View, TouchableOpacity } from 'react-native';
import CheckBox from 'react-native-checkbox-component';
import {Agenda} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionButton from 'react-native-action-button';
import { SafeAreaProvider } from "react-native-safe-area-context";
import Completed from './body/Completed';
import NotCompletePassed from './body/NotCompletePassed';
import NotCompleteFuture from './body/NotCompleteFuture';
import NotCompleteCurrent from './body/NotCompleteCurrent';

export default class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.spinValue = new Animated.Value(0);
    this.state = {
      today:new Date(),
      loading:false,
      items:undefined,
      loadedKeys:[],
    };
  }
  componentWillReceiveProps(){}

  componentDidMount() {
    //this.clean();
    this.loadDataSet();
    this.spin();   
  }

  componentDidUpdate(prevProps) {
    const { route } = this.props;
    const { key } = route?.params ?? {};
    const { loadedKeys } = this.state;
    
    if (key && key !== prevProps.route?.params?.key && !loadedKeys.includes(key)) {
      this.setState({ loading: true });
      this.retrieveData(key).then(() => {
        this.setState({ loadedKeys: [...loadedKeys, key], loading: false });
      }).catch((error) => {
        console.error(error);
        this.setState({ loading: false });
      });
    } 
  }

  retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        const parsedJSON = JSON.parse(value);
        var ourDate = this.parseDateIntoStringAndVice(parsedJSON.date);

        if (!this.state.items[ourDate]) {
          this.state.items[ourDate] = [];        
        } 

        this.state.items[ourDate].push({
          start: parsedJSON.start,
          end: parsedJSON.end,
          name: parsedJSON.name,
          description: parsedJSON.description,
          height: 100,//parsedJSON.height,
           // Math.max(50, Math.floor(Math.random() * 150)),
          completed: parsedJSON.completed,
          date:parsedJSON.date,
          key:key,
        });
        this.state.items[ourDate].sort((a, b) => new Date(a.date) - new Date(b.date));
      }
    } catch (error) {
     console.error(error);
    }
  };

  spin() {
    this.spinValue.setValue(0);
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true
      }
    ).start(() => this.spin());
  }

  getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        this.setState({ storedValue: value });
      }
    } catch (e) {
      console.error('Error reading value from AsyncStorage');
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
        JSON.stringify(data),
      );
    } catch (error) {
      console.error(error)
    }
  }

  deleteFromStorage = async (key) =>{
    try {
      await AsyncStorage.removeItem(key);
    }
    catch(error) {
      console.error(error)
    }
  }

  loadDataSet = async () =>{
      this.setState({ loading: true });
      let items = {};
    
      // Initialize items object
      let today = new Date();
      for (let i = 1; i < 365; i++) {
        today.setDate(today.getDate() + 1);
        let val = this.parseDateIntoStringAndVice(today);
        if (!items[val]) {
          items[val] = [];
        }
      }
      today = new Date();
      for (let i = 1; i < 365; i++) {
        today.setDate(today.getDate() - 1);
        let val = this.parseDateIntoStringAndVice(today);
        if (!items[val]) {
          items[val] = [];
        }
      }
    
      // Import data from AsyncStorage
      try {
        const keys = await AsyncStorage.getAllKeys();
        if (keys.length === 0) {
          this.setState({ items: undefined });
          this.setState({ loading: false });
          return;
        }
        this.setState({ loadedKeys: keys });
    
        let timestamps = [];
    
        for (const key of keys) {
          const value = await AsyncStorage.getItem(key);
          const parsedJSON = JSON.parse(value);
          let timestamp = new Date(parsedJSON.date).getTime();
          var ourDate = this.parseDateIntoStringAndVice(parsedJSON.date);
    
          timestamps.push(timestamp);
    
          if (!items[ourDate]) {
            items[ourDate] = [];
          }
    
          items[ourDate].push({
            start: parsedJSON.start,
            end: parsedJSON.end,
            name: parsedJSON.name,
            description: parsedJSON.description,
            height: 100,
            completed: parsedJSON.completed,
            date: parsedJSON.date,
            day: parsedJSON.date,
            key: key,
          });
          items[ourDate].sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        this.setState({ items });
      } catch (error) {
        console.error(error);
      }
      this.setState({ loading: false });

    
  }

  
  render() {
    const { loading } = this.state;
    if(!loading){
    return (
      <SafeAreaProvider style={{flex:1}}>        
      <Agenda
        //testID={testIDs.agenda.CONTAINER}
        items={this.state.items}
        loadItemsForMonth={this.loadItemsForMonth}
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

    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
    return (
      <View style={styles.container}>
        <Animated.Text
          style={[styles.logo, { transform: [{ rotate: spin }] }]}
        >
          Daily App
        </Animated.Text>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  reservationsKeyExtractor = (item, index) => {
    return `${item?.reservation?.day}${index}`;
 };


  deleteEvent = (reservation) => {
      Alert.alert('Do you want to remove the event?', reservation.name, [
        {
          text: 'Close',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Remove', onPress: () => {
          this.deleteFromStorage(reservation.key);
          this.loadDataSet();
        }},
      ]);
}

  createCompletness = (reservation) =>{
    if(!reservation.completed){
      Alert.alert('Is this event completed?', reservation.name, [
        {
          text: 'Close',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Completed', onPress: () => {
          reservation.completed = true
          this.updateData(reservation.key,reservation);
          this.loadDataSet();
        }},
      ]);
    }else{
      Alert.alert('Event became valid?', reservation.name, [
        {
          text: 'Close',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Completed', onPress: () => {
          reservation.completed = false
          this.updateData(reservation.key,reservation);
          this.loadDataSet();
        }},
      ]);
    }
  }

  
  loadItemsForMonth = (day) => {
    
    let items = this.state.items;
    if(items==undefined){
      items = {};
    }
    if (!items[day.dateString]) {
      items[day.dateString] = [];        
    }
    let buildDate = new Date();
    buildDate.setFullYear(day.year,day.month,day.day);
    let nextDay = new Date(buildDate);
    for(let i=1;i<31;i++){
      nextDay.setDate(nextDay.getDate() + 1);
      let val = this.parseDateIntoStringAndVice(nextDay);
      if (!items[val]) {
        items[val] = [];        
      }
    } 
    for(let i=1;i<31;i++){
      nextDay.setDate(nextDay.getDate() -1);
      let val = this.parseDateIntoStringAndVice(nextDay);
      if (!items[val]) {
        items[val] = [];        
      }
    } 

      this.setState({
        items
      });
    
    
  }

  renderItem = (reservation, isFirst) => {

    var now = new Date();
    var meetingStart = new Date(Date.parse(reservation.date));
    meetingStart.setHours(meetingStart.getHours()-2);
    var meetingEnd = new Date(Date.parse(reservation.date));
    meetingEnd.setHours(meetingEnd.getHours()-2);


    let time = reservation.end.split(":");
    meetingEnd.setHours(time[0],time[1]);

    if(reservation.completed){
      return (
        <TouchableOpacity
        onLongPress={() => this.deleteEvent(reservation)}
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
        <Completed data={reservation}/>        
      </TouchableOpacity>
  
      );
    }
    if (now < meetingStart) {

      return (
      <TouchableOpacity      
      onLongPress={() => this.deleteEvent(reservation)}
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
        
        <NotCompleteFuture data={reservation}/>
      </TouchableOpacity>
    );
    } else {
      if(now < meetingEnd){
        return (
          <TouchableOpacity
          onLongPress={() => this.deleteEvent(reservation)}
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
            
            <NotCompleteCurrent data={reservation}/>
          </TouchableOpacity>
          );
      }else{
      return (
        <TouchableOpacity
        onLongPress={() => this.deleteEvent(reservation)}
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
          <NotCompletePassed data={reservation}/>
        </TouchableOpacity>
        );
      }
    }
  }



  parseBody = (reservation) => {
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
    //date.setHours(0);
    //date.setMinutes(0);
    //date.setSeconds(0);
    //date.setMilliseconds(0);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return formattedDate
  }

  renderEmptyDate = ({date}) => {
    return (
      <View style={styles.emptyDate}>
        <Text>No events!</Text>
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
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
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
  },
  //beaty spinner
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333'
  },
  text: {
    marginTop: 20,
    fontSize: 20,
    color: '#333'
  }
});
