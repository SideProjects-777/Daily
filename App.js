import {AppRegistry} from 'react-native';
import React, {Component} from 'react';
import {Alert, Modal,StyleSheet, Text, Button, View, TouchableOpacity, TextInput} from 'react-native';
import {Agenda, DateData, AgendaEntry, AgendaSchedule} from 'react-native-calendars';
import testIDs from './dataSet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionButton from 'react-native-action-button';
import { TimePickerModal, DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default class App extends Component {

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
      modalVisible: false,
      showFromTimePicker: false,
      showToTimePicker: false,
      showDatePicker: false,
    };
  }

  componentDidMount() {
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


  getAllKeys = async () => {
    try {
      return AsyncStorage.getAllKeys();
    } catch (e) {
      console.log('Error storing value in AsyncStorage');
    }
  }

  storeData = async (key) => {
    try {
      console.log(key);
      await AsyncStorage.setItem("1", this.state);
      //this.setState({ storedValue: this.state.inputValue });
    } catch (e) {
      console.log('Error storing value in AsyncStorage');
    }
  };

  handleSave = () => {
    const { fromHourTime, fromMinuteTime, date } = this.state;
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();


    var dateTarget = new Date();
    dateTarget.setDay(day);
    dateTarget.setMonth(month-1);
    dateTarget.setFullYear(year);
    dateTarget.setHours(fromHourTime);
    dateTarget.setMinutes(fromMinuteTime);
    dateTarget.setSeconds(0);
    dateTarget.setMilliseconds(0); 
    console.log(dateTarget);
    
    //this.storeData(dateTarget.toString());

    this.setState({
      name: '',
      description: '',
      fromHourTime: new Date().getHours(),
      fromMinuteTime: new Date().getMinutes(),
      toHourTime: new Date().getHours()+1,
      toMinuteTime: new Date().getMinutes(),
      date: new Date(),
    });
    this.updateVisibility(false)
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
    });
    this.updateVisibility(false)
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
    console.log({ hours, minutes });
    this.setState({ showToTimePicker: false, toHourTime:hours, toMinuteTime:minutes });
  }

  onDismissDate = () => {
    this.setState({ showDatePicker: false });
  }

  onConfirmDate = ({date}) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
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
        loadItemsForMonth={this.loadData}
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
            Alert.alert('Modal has been closed.');
            this.updateVisibility(this.state.changeVisibility);
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
                          locale='en'
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
        <ActionButton buttonColor="rgba(231,76,60,1)" useNativeDriver={false} onPress={() => this.updateVisibility(this.state.changeVisibility)}>
        </ActionButton>
      </SafeAreaProvider>
    );
  }

  reservationsKeyExtractor = (item, index) => {
    return `${item?.reservation?.day}${index}`;
 };


  updateVisibility = (val) =>{
    this.setState({modalVisible:val})
  }

  loadData = (day) =>{
    const items = this.state.items || {};
    const newItems = {};
    /*
    let keys = this.getAllKeys();
    console.log('Hello ')
    console.log(keys)
    for(key in keys){
      let val = this.getData(key);
      newItems[key] = val;
    }
    */
    this.setState({
      items: newItems
    });
  }

  loadItems = (day) => {
    const items = this.state.items || {};

    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!items[strTime]) {
          items[strTime] = [];
          
          const numItems = 2//Math.floor(Math.random() * 3 + 1);
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
        }
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
  marginL:{
    marginLeft:50,
    height:'20%'
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: 'grey',
    marginVertical: 10,
    backgroundColor:'yellow',
    width:'100%'
  },
});
