import React, {Component} from 'react';
import {Alert, Modal,StyleSheet, Text, Button, View, TouchableOpacity, TextInput} from 'react-native';
import {Agenda} from 'react-native-calendars';
import testIDs from './dataSet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionButton from 'react-native-action-button';
import { TimePickerModal, DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      fromHourTime: new Date().getHours(),
      fromMinuteTime: new Date().getMinutes(),
      toHourTime: new Date().getHours()+1,
      toMinuteTime: new Date().getMinutes(),
      date: new Date(),
      items: undefined,
      fetchedData:[],
      modalVisible: false,
      showFromTimePicker: false,
      showToTimePicker: false,
      showDatePicker: false,
      completed:false,
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
          height: 100, // Math.max(50, Math.floor(Math.random() * 150)),
          completed: false,
        });
      }
  
      this.setState({ fetchedData });
    } catch (error) {
      console.error(error);
    }
  };
  

  storeData = async (key) => {
    try {
      
      var body = {
        'name':this.state.name,
        'description':this.state.description,
        'completed': this.state.completed,
        'fromHourTime': this.state.fromHourTime,
        'fromMinuteTime': this.state.fromMinuteTime,
        'toHourTime': this.state.toHourTime,
        'toMinuteTime': this.state.toMinuteTime,
        'date': this.state.date
      }
      const jsonString = JSON.stringify(body);      
      await AsyncStorage.setItem(key, jsonString);
      //this.setState({ storedValue: this.state.inputValue });
    } catch (e) {
      console.log('Error storing value in AsyncStorage');
    }
  };

  generateMilliSeconds(){
    const min = 100;  // Minimum value of the integer
    const max = 999;  // Maximum value of the integer
    const randomInt = Math.floor(Math.random() * (max - min + 1) + min);
    return randomInt;
  }

  handleSave = () => {
    const { fromHourTime, fromMinuteTime, date } = this.state;
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    var dateTarget = new Date();
    dateTarget.setDate(day);
    dateTarget.setMonth(month-1);
    dateTarget.setFullYear(year);
    dateTarget.setUTCHours(fromHourTime);
    dateTarget.setMinutes(fromMinuteTime);
    dateTarget.setSeconds(0);
    dateTarget.setMilliseconds(this.generateMilliSeconds());
    let key = dateTarget.getTime() * 1000000;
    let keyString = key.toString();
    
    this.storeData(keyString);

    this.setState({
      name: '',
      description: '',
      fromHourTime: new Date().getHours(),
      fromMinuteTime: new Date().getMinutes(),
      toHourTime: new Date().getHours()+1,
      toMinuteTime: new Date().getMinutes(),
      date: new Date(),
      modalVisible:false
    });
    
  };

  handleCancel = () => {
    this.setState({
      name: '',
      description: '',
      fromHourTime: new Date().getHours(),
      fromMinuteTime: new Date().getMinutes(),
      toHourTime: new Date().getHours()+1,
      toMinuteTime: new Date().getMinutes(),
      date: new Date(),
      modalVisible:false
    });
  };

  onDismissFrom = () => {
    this.setState({ showFromTimePicker: false });
  }

  onConfirmFrom = ({ hours, minutes }) => {
    this.setState({ showFromTimePicker: false, fromHourTime:hours, fromMinuteTime:minutes });
  }


  onDismissTo = () => {
    this.setState({ showToTimePicker: false });
  }

  onConfirmTo = ({ hours, minutes }) => {
    this.setState({ showToTimePicker: false, toHourTime:hours, toMinuteTime:minutes });
  }

  onDismissDate = () => {
    this.setState({ showDatePicker: false });
  }

  onConfirmDate = ({date}) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = new Date(year, month-1, day);
    this.setState({ showDatePicker: false,date:currentDate  });    
  }

  render() {
    const { name, 
      description, 
      fromHourTime,
      fromMinuteTime,
      toHourTime,
      toMinuteTime,
      date, 
      modalVisible, 
      showFromTimePicker,
      showToTimePicker,
      showDatePicker } = this.state;

    return (
      <SafeAreaProvider style={{flex:1}}>        
      <Agenda
        testID={testIDs.agenda.CONTAINER}
        items={this.state.items}
        loadItemsForMonth={this.loadItems}
        selected={'2023-05-16'}
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
        <Modal
          animationType="slide"
          useNativeDriver={true}
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible:false})
          }}>
          <View style={styles.centeredView}>
                <View style={styles.modalView}>
                      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Add Event</Text>
                      <Text style={styles.label}>Name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Name"
                        value={name}
                        onChangeText={(name) => this.setState({ name })}
                      />
                      <Text style={styles.label}>Description</Text>
                      <TextInput
                        style={styles.inputBig}
                        placeholder="Enter Description"
                        value={description}
                        onChangeText={(description) => this.setState({ description })}
                        multiline
                      />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, marginTop:20 }}>
                    <Button onPress={() => this.setState({ showFromTimePicker: true })} uppercase={false} title='Pick from' />
                      <TimePickerModal
                        visible={showFromTimePicker}
                        onDismiss={this.onDismissFrom}
                        onConfirm={this.onConfirmFrom}
                        hours={fromHourTime}
                        minutes={fromMinuteTime}
                      />
                    <View style={{width:30}}></View>
                    <Button onPress={() => this.setState({ showToTimePicker: true })} uppercase={false}  title='Pick to'/>
                      <TimePickerModal
                          visible={showToTimePicker}
                          onDismiss={this.onDismissTo}
                          onConfirm={this.onConfirmTo}
                          hours={toHourTime}
                          minutes={toMinuteTime}
                      />
                    </View>
                    <View style={styles.divider} />
                    <View style={{ flexDirection: 'row' }}>
                    <Button onPress={() => this.setState({showDatePicker:true})} uppercase={false} mode="outlined" title='Pick single date' />
                        <DatePickerModal
                          locale={'en'}
                          mode="single"
                          visible={showDatePicker}
                          onDismiss={this.onDismissDate}
                          date={date}
                          onConfirm={this.onConfirmDate}
                        />
                    </View>
                    <View style={styles.divider} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                      <Button title="Save" onPress={this.handleSave} style={styles.buttonSave}  />
                      <View style={{width:30}}></View>
                      <Button title="Close" color='red' onPress={this.handleCancel} style={[styles.button, styles.buttonClose]} />
                  </View>
                </View>
          </View>
        </Modal>
        <ActionButton useNativeDriver={false} onPress={() =>this.setState({modalVisible:true})}>
        </ActionButton>
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
    console.log(this.state.fetchedData)
    const items = this.state.items || {};

    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!items[strTime]) {
          items[strTime] = [];
          
          const numItems = 2//Math.floor(Math.random() * 3 + 1);
          /*
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              start: '12.00',
              end: '13.00',
              name: 'Item for ' + strTime + ' #' + j,
              description:'Hello my name is Jay',
              height: 100, // Math.max(50, Math.floor(Math.random() * 150)),
              day: strTime,
              completed: false
            });
          }
          */
        }
      }
      const time = day.timestamp + 0 * 24 * 60 * 60 * 1000;
      const strTime = this.timeToString(time);
      for (data of this.state.fetchedData){
        items[strTime].push({
          start: data.start,
          end: data.end,
          name: data.name,
          description:data.description,
          height: 100, // Math.max(50, Math.floor(Math.random() * 150)),
          day: strTime,
          completed: false
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
    const fontSize = isFirst ? 16 : 14;
    const color = isFirst ? 'black' : 'gray';

    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, {height: reservation.height}]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <Text style={{fontSize, color}}>{reservation.start} - {reservation.end}</Text>
        <Text style={{fontSize, color}}>{reservation.name}</Text>
        <Text style={{fontSize, color}}>{reservation.description}</Text>        
      </TouchableOpacity>
    );
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
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  //Modal Window
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '90%',
    minHeight:'20%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  //form
  label: {
    marginTop: 20,
    marginBottom: 15,
  },
  input: {
    width:'90%',
    minHeight:'5%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    fontSize: 18,
  },

  inputBig: {
    minHeight:'20%',
    width:'90%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    fontSize: 18,
  },

  //buttons

  actions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth:0.5,
    borderTopColor:'#b3b3b3',
    borderBottomWidth:0.5,
    borderBottomColor:'#b3b3b3',
    padding:40

  },
  button: {    
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft:10,
  },
  buttonSave:{
    backgroundColor: '#17993a',
  },  
  buttonClose:{
    backgroundColor: '#d90b2d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonTextSave: {
    color: '#fff',
    fontSize: 16,
  },

  //mixed inputs

  actionsInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: 'grey',
    marginVertical: 10,
    backgroundColor:'yellow',
    width:'100%'
  },
});
