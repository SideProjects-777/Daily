import React, {Component} from 'react';
import {Alert, Modal,StyleSheet, Text,  Animated, Easing, View, TouchableOpacity, ScrollView} from 'react-native';
import {Agenda} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionButton from 'react-native-action-button';
import { SafeAreaProvider } from "react-native-safe-area-context";


export default class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.spinValue = new Animated.Value(0);
    this.state = {
      today:new Date(),
      loading:false,
      fetchedData:[],
      keys:[],
    };
  }

  componentDidMount() {
    //this.clean();
    this.importData();
    this.spin();
  }

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


  importData = async () => {
    this.setState({loading:true});
    try {
      const keys = await AsyncStorage.getAllKeys();
      if (keys.length === 0) {
        this.setState({ fetchedData:[] });
        return;
      }
  
      const fetchedData = [];
  
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        const parsedJSON = JSON.parse(value);
        var ourDate = this.parseDateIntoStringAndVice(parsedJSON.date);

        if (!fetchedData[ourDate]) {
          fetchedData[ourDate] = [];        
        } 

        fetchedData[ourDate].push({
          start: parsedJSON.start,
          end: parsedJSON.end,
          name: parsedJSON.name,
          description: parsedJSON.description,
          height:Math.max(100, Math.floor(Math.random() * 150)), //parsedJSON.height,
           // Math.max(50, Math.floor(Math.random() * 150)),
          completed: parsedJSON.completed,
          date:parsedJSON.date,
          key:key,
        });
      }

      let today = new Date();
      for(let i=1;i<365;i++){
        today.setDate(today.getDate() + 1);
        let val = this.parseDateIntoStringAndVice(today);
        if (!fetchedData[val]) {
          fetchedData[val] = [];        
        }
      }
      today = new Date();
      for(let i=1;i<365;i++){
        today.setDate(today.getDate() - 1);
        let val = this.parseDateIntoStringAndVice(today);
        if (!fetchedData[val]) {
          fetchedData[val] = [];        
        }
      }
      this.setState({ fetchedData });
      this.setState({loading:false});
    } catch (error) {
      console.error(error);
    }
  };


  
  render() {
    //console.log(this.state.fetchedData);
    const { loading } = this.state;
    if(!loading){
    return (
      <SafeAreaProvider style={{flex:1}}>        
      <Agenda
        //testID={testIDs.agenda.CONTAINER}
        items={this.state.fetchedData}
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
          this.importData();
        }},
      ]);
    }else{
      Alert.alert('Do you want to remove the event?', reservation.name, [
        {
          text: 'Close',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Remove', onPress: () => {
          this.deleteFromStorage(reservation.key);
          this.importData();
        }},
      ]);
    }



  }

  
  loadItemsForMonth = (day) => {
    //console.log(day)
    const fetchedData = this.state.fetchedData;
    if (!fetchedData[day.dateString]) {
      fetchedData[day.dateString] = [];        
    }
    let buildDate = new Date();
    buildDate.setFullYear(day.year,day.month,day.day);
    let nextDay = new Date(buildDate);
    for(let i=1;i<31;i++){
      nextDay.setDate(nextDay.getDate() + 1);
      let val = this.parseDateIntoStringAndVice(nextDay);
      if (!fetchedData[val]) {
        fetchedData[val] = [];        
      }
    } 
    for(let i=1;i<31;i++){
      nextDay.setDate(nextDay.getDate() -1);
      let val = this.parseDateIntoStringAndVice(nextDay);
      if (!fetchedData[val]) {
        fetchedData[val] = [];        
      }
    } 

      this.setState({
        fetchedData
      });
    
    
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
      onPress={() => this.createCompletness(reservation,isFirst)} 
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
