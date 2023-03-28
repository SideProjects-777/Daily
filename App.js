import React, {Component} from 'react';
import {Alert, Modal,StyleSheet, Text, Pressable,View, TouchableOpacity, TextInput} from 'react-native';
import {Agenda, DateData, AgendaEntry, AgendaSchedule} from 'react-native-calendars';
import testIDs from './dataSet';
import ActionButton from 'react-native-action-button';
import DatePicker from 'react-native-date-picker';

export default class App extends Component {
  state = {
    items: undefined,
    modalVisible: false,
    name:'',
    from:new Date(),
    openFrom:false,
    to:new Date(),
    openTo:false,
    day:'',
    bio:'',
  };

   reservationsKeyExtractor = (item, index) => {
     return `${item?.reservation?.day}${index}`;
  };

  render() {
    return (
      <View style={{flex:1}}>        
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
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            this.updateVisibility(this.state.changeVisibility);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.actionsInputs}>

                <TouchableOpacity style={[styles.button, styles.buttonClose]}  onPress={() => this.setOpenFrom(true)}>
                    <Text style={styles.buttonText}>From</Text>
                  </TouchableOpacity>
                  <DatePicker
                    modal
                    open={this.state.openFrom}
                    date={this.state.from}
                    onConfirm={(date) => {
                      this.setOpenFrom(false)
                      this.setFrom(date)
                    }}
                    onCancel={() => {
                      this.setOpenFrom(false)
                    }}
                  />

                <Text style={styles.label}>To</Text>
                <TouchableOpacity style={[styles.button, styles.buttonClose]}  onPress={() => this.setOpenTo(true)}>
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
                  <DatePicker
                      modal
                      open={this.state.openTo}
                      date={this.state.to}
                      onConfirm={(date) => {
                        this.setOpenTo(false)
                        this.setTo(date)
                      }}
                      onCancel={() => this.setOpenTo(false)}
                    />
              </View>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Name"
                value={this.state.name}
                onChangeText={this.setName}
              />
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.inputBig}
                placeholder="Enter Description"
                value={this.state.bio}
                onChangeText={this.setBio}
              />

              <View style={styles.actions}>
                  <TouchableOpacity style={[styles.button, styles.buttonClose]}  onPress={() =>{}}>
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.buttonSave]}   onPress={() => this.updateVisibility(this.state.changeVisibility)}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item 
          buttonColor='#9b59b6' 
          title="New Task" 
          useNativeDriver={false}
          onPress={() => this.updateVisibility(this.state.changeVisibility)}
          >
            <Text>+</Text>
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }

  setFrom = (val) => {
    this.setState({from:val})
  }

  setOpenFrom = (val) => {
    this.setState({openFrom:val})
  }

  setTo = (val) => {
    this.setState({to:val})
  }

  setOpenTo = (val) => {
    this.setState({openTo:val})
  }

  setName = (val) => {
    this.setState({name:val})
  }

  setBio = (val) => {
    this.setState({bio:val})
  }

  setEmail = (val) => {
    this.setState({email:val})
  }

  updateVisibility = (val) =>{
    this.setState({modalVisible:val})
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

    const descFontSize = 12
    const descrColor = 'gray';

    const timeFontSize = 18
    const timeColor = 'black';

    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, {height: reservation.height}]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <Text style={{timeFontSize, timeColor}}>{reservation.start} - {reservation.end}</Text>
        <Text style={{fontSize, color}}>{reservation.name}</Text>
        <Text style={{descFontSize, descrColor}}>{reservation.description}</Text>        
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
});