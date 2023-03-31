import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { TimePickerModal, DatePickerModal } from 'react-native-paper-dates';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class NewEvent extends Component {
  state = {
    name: '',
    description: '',
    fromHourTime: new Date().getHours(),
    fromMinuteTime: new Date().getMinutes(),
    toHourTime: new Date().getHours() + 1,
    toMinuteTime: new Date().getMinutes(),
    date: new Date(),
    showFromTimePicker: false,
    showToTimePicker: false,
    showDatePicker: false,
  };

  handleSave = () => {
    const { fromHourTime, fromMinuteTime, date } = this.state;
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const dateTarget = new Date(
      year,
      month - 1,
      day,
      fromHourTime,
      fromMinuteTime,
      0,
      this.generateMilliSeconds()
    );
    const key = dateTarget.getTime() * 1000000;

    this.storeData(key.toString());

    this.setState({
      name: '',
      description: '',
      fromHourTime: new Date().getHours(),
      fromMinuteTime: new Date().getMinutes(),
      toHourTime: new Date().getHours() + 1,
      toMinuteTime: new Date().getMinutes(),
      date: new Date(),
      showFromTimePicker: false,
      showToTimePicker: false,
      showDatePicker: false,
    });
  };

  handleCancel = () => {
    this.setState({
      name: '',
      description: '',
      fromHourTime: new Date().getHours(),
      fromMinuteTime: new Date().getMinutes(),
      toHourTime: new Date().getHours() + 1,
      toMinuteTime: new Date().getMinutes(),
      date: new Date(),
      showFromTimePicker: false,
      showToTimePicker: false,
      showDatePicker: false,
    });
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
        'date': this.state.date,
        'completed':false
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

  onDismissFrom = () => {
    this.setState({ showFromTimePicker: false });
  };

  onConfirmFrom = ({ hours, minutes }) => {
    this.setState({ showFromTimePicker: false, fromHourTime: hours, fromMinuteTime: minutes });
  };

  onDismissTo = () => {
    this.setState({ showToTimePicker: false });
  };

  onConfirmTo = ({ hours, minutes }) => {
    this.setState({ showToTimePicker: false, toHourTime: hours, toMinuteTime: minutes });
  };

  onDismissDate = () => {
    this.setState({ showDatePicker: false });
  };

  onConfirmDate = ({ date }) => {
    this.setState({ showDatePicker: false, date });
  };


  render() {
    const { name, 
      description, 
      fromHourTime,
      fromMinuteTime,
      toHourTime,
      toMinuteTime,
      date,
      showFromTimePicker,
      showToTimePicker,
      showDatePicker } = this.state;

    return (
        <View style={styles.centeredView}>
        <View style={styles.modalView}>
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
    );
  }
}

const styles = StyleSheet.create({
    //Modal Window
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:90
    },
    modalView: {
      width: '90%',
      padding: 5,
      alignItems: 'center',
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
  
