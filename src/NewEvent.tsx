import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ScrollView, Image } from 'react-native';
import { TimePickerModal, DatePickerModal } from 'react-native-paper-dates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalendarDate, SingleChange } from 'react-native-paper-dates/lib/typescript/Date/Calendar';

import StorageService from './service/StorageService';
import NewEventService from './service/NewEventService';

import { en, registerTranslation} from 'react-native-paper-dates'

registerTranslation('en', en);
type Props = {
  navigation: any;
};

type State = {
  name: string;
  description: string;
  start: string;
  end: string;
  date: CalendarDate;
  showFromTimePicker: boolean;
  showToTimePicker: boolean;
  showDatePicker: boolean;
  key: string;
  validation:{
    from: Date | number,
    to: Date | number,    
  };
  error:boolean;
};

export default class NewEvent extends Component<Props, State> {

  state: State = {
    name: '',
    description: '',
    start: '',
    end: '',
    date: new Date(),
    showFromTimePicker: false,
    showToTimePicker: false,
    showDatePicker: false,
    key: '',
    validation:{
      from: new Date(),
      to: new Date(new Date().setHours(new Date().getHours() + 1)),
    },
    error:false,
  };

  componentDidMount(): void {
    const {route} = this.props;
    const {reservation} = route
    ?.params ?? {};    
    if(reservation){
      console.log(reservation);
      this.setState({
        name: reservation.name,
        description: reservation.name,
        start: reservation.start,
        end: reservation.end,
        date: new Date(reservation.date),
        showFromTimePicker: false,
        showToTimePicker: false,
        showDatePicker: false,
        key: reservation.key, 
        validation:{
          from: NewEventService.parseDateLatest(new Date(reservation.date), reservation.start),
          to: NewEventService.parseDateLatest(new Date(reservation.date), reservation.end),
        },
        error:false,
      });
    }
  }


  restoreState = () => {
    this.setState({
      name: '',
      description: '',
      start: '',
      end: '',
      date: new Date(),
      showFromTimePicker: false,
      showToTimePicker: false,
      showDatePicker: false,
      key: '',
      validation:{
        from: new Date(),
        to: new Date(new Date().setHours(new Date().getHours() + 1)),
      },
      error:false,
    });
  }


  handleSave = () => {
    const {key} = this.state;
    const newKey = Math.random().toString(36).substring(2, 14);
    
    if(!this.validate()){
      if(key){
        const event = {
          name: this.state.name,
          description: this.state.description,
          start: this.state.start,
          end: this.state.end,
          date: NewEventService.parseDateLatest(this.state.date, this.state.start),
          completed: false,
          key:key
        };
        StorageService.updateData(key,event);
        this.props.navigation.navigate('Home',  event);
      }else{  
        const event = {
          name: this.state.name,
          description: this.state.description,
          start: this.state.start,
          end: this.state.end,
          date: NewEventService.parseDateLatest(this.state.date, this.state.start),
          completed: false,
          key:newKey
        };      
        StorageService.post(newKey,event); 
        this.props.navigation.navigate('Home',  event);       
      }
      this.restoreState();  
      
    }else{
      this.setState({error:true})
    }
    
  };

  handleCancel = () => {
    this.restoreState();
    this.props.navigation.navigate('Home');
  };


  onDismissFrom = () => {
    this.setState({ showFromTimePicker: false });
  };

  onConfirmFrom = ({ hours, minutes } :  { hours: number, minutes: number }) => {
    let parsedMinutes  = `${minutes < 10 ? '0'+minutes : minutes}`;
    let finalAnswer = hours+':'+parsedMinutes
    this.setState({ showFromTimePicker: false, start:finalAnswer });
  };

  validate = () =>{
    let date = this.state.date;
    let start = this.state.start;
    let end = this.state.end;

    if(!start && !end){ 
      //console.log("Both not provided")
      return false;
    }
    else if(!start || !end){
      //Another issue
      return true;
    }
    const dayDate = new Date(date);
    const startTime = new Date(`${dayDate.toISOString().substr(0, 10)}T${start}:00`);
    const endTime = new Date(`${dayDate.toISOString().substr(0, 10)}T${end}:00`);
    
    if (startTime.getTime() < endTime.getTime()) {
      return false;
    } else {
      return true;
    }
  }

  onDismissTo = () => {
    this.setState({ showToTimePicker: false });
  };

  onConfirmTo = ({ hours, minutes }:  { hours: number, minutes: number }) => {
    let parsedMinutes  = `${minutes < 10 ? '0'+minutes : minutes}`;
    let finalAnswer = hours+':'+parsedMinutes
    this.setState({ showToTimePicker: false, end:finalAnswer});
  };

  onDismissDate = () => {
    this.setState({ showDatePicker: false });
  };

  onConfirmDate: SingleChange = ({ date }: { date: CalendarDate }) => {
    this.setState({ showDatePicker: false, date });
  };

  formatDate = (date: CalendarDate) => {
    if (!date) {
      date =  new Date();
    }
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).split("/").join("-");
    return formattedDate;
  };

    render() {
        const { name, 
          description, 
          start,
          end,
          date,
          showFromTimePicker,
          showToTimePicker,
          validation,
          error,
          showDatePicker } = this.state;
          
    
        return (
          <ScrollView>
            {/*
            <Image
                  source={require('../assets/new.jpg')}
                  style={styles.background}
            /> 
            */
            }
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
                <View style={{width:'100%', height:1, marginTop:15}}></View>
                <Button onPress={() => this.setState({ showFromTimePicker: true })} title='Pick from' />
                <View style={{width:'100%', height:1, marginTop:15}}></View>
                  <TextInput
                    style={styles.input}
                    value={start.toString()}
                    editable={false}
                    placeholder="Duration From"
                  />                  
                {error ? (
                    <Text style={{color:"red"}}>*Time invalid, select correct from</Text>
                  ) : (
                   <></>
                  )}
                  <TimePickerModal
                    visible={showFromTimePicker}
                    onDismiss={this.onDismissFrom}
                    onConfirm={this.onConfirmFrom}
                    hours={validation.from?.getHours()}
                    minutes={validation.from?.getMinutes()}
                    label={"From"}
                    animationType='fade'
                  />
                  <View style={{width:'100%', height:1, marginTop:15}}></View>
                <Button onPress={() => this.setState({ showToTimePicker: true })}  title='Pick to'/>
                <View style={{width:'100%', height:1, marginTop:15}}></View>
                <TextInput
                    style={styles.input}
                    value={end.toString()}
                    editable={false}
                    placeholder="Duration To"
                  />
                  {error ? (
                    <Text style={{color:"red"}}>*Time invalid, select correct to</Text>
                  ) : (
                   <></>
                  )}
                  
                  <TimePickerModal
                      visible={showToTimePicker}
                      onDismiss={this.onDismissTo}
                      onConfirm={this.onConfirmTo}
                      hours={(validation.to?.getHours())}
                      minutes={validation.to?.getMinutes()}
                      label={"To"}
                      animationType='fade'
                  />
                <View style={{width:'100%', height:1, marginTop:15}}></View>
                <Button onPress={() => this.setState({showDatePicker:true})} title='Pick single date' />
                <View style={{width:'100%', height:1, marginTop:15}}></View>
                <TextInput
                    style={styles.input}
                    value={this.formatDate(date)}
                    editable={false}
                    placeholder="Event Day"
                  />
                    <DatePickerModal
                      locale={'en'}
                      mode="single"
                      visible={showDatePicker}
                      onDismiss={this.onDismissDate}
                      date={date}
                      onConfirm={this.onConfirmDate}
                    />
                
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                  <Button title="Save" onPress={this.handleSave} />
                  <View style={{width:30}}></View>
                  <Button title="Close" color='red' onPress={this.handleCancel} />
              </View>
            </View>
      </View>
      </ScrollView>
        );
      }
}


const styles = StyleSheet.create({
    //Modal Window
    background: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      opacity:0.3
  },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height:'100%',
      marginBottom:100,
      marginTop:60
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
    buttonStyle:{
      marginTop:50,
      marginBottom:100,
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
      minHeight:'15%',
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
    buttonSave:{
      backgroundColor: '#17993a',
    },  
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
    buttonTextSave: {
      color: '#fff',
      fontSize: 16,
    },  
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