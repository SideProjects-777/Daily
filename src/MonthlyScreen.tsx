import React, {Component, ReactNode} from 'react';
import { Calendar } from 'react-native-big-calendar';
import { View, Text, Button, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const now = new Date();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const events = [
  {
    title: 'Meeting',
    start: new Date(),
    end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 2, now.getMinutes()),
  },
  {
    title: 'Date',
    start: new Date(2023, 4, 11, 10, 0),
    end: new Date(2023, 4, 11, 10, 30),
  },
  {
    title: 'Coffee break',
    start: new Date(2023, 4, 15, 15, 45),
    end: new Date(2023, 4, 15, 16, 30),
  },
];


interface State {
  today : Date;
}


class MonthlyScreen extends Component < any, State > {

  constructor(props : {}) {
    super(props);
    this.state = {
        today: new Date(),
    };
}

navToWeekScreen =(date: Date) => {

  //console.log(date)
  this.props.navigation.navigate('Weekly', {date:date})
}


nextMonth = () => {
  var {today} = this.state;
  var nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  this.setState({today:nextMonth});
};

prevMonth = () => {
  var {today} = this.state;
  // Get the previous month
  var previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  this.setState({today:previousMonth})
};


  render() {
    const {today} = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.buttonContainer}>         
            <FontAwesome name="calendar" size={22} color="#4186f5" />
          </TouchableOpacity>
        <ScrollView nestedScrollEnabled={true} horizontal={false}>

        <View style={styles.scroller}>
          <TouchableOpacity style={styles.button} onPress={() => this.prevMonth() }>
          <FontAwesome name="step-backward" size={22} color="#4186f5" />
          </TouchableOpacity>
          <View style={styles.month}>
            <Text style={styles.monthText}>{today.toLocaleString('default', { month: 'long' })} / {today.getFullYear()}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => this.nextMonth() }>
            <FontAwesome name="step-forward" size={22} color="#4186f5" />
          </TouchableOpacity>
        </View>
          <Calendar
            mode={'month'}
            events={events}
            height={windowHeight- 200}
            swipeEnabled={false}
            date={today}
            onPressCell={(date: Date) => {this.navToWeekScreen(date)}}
            //calendarCellStyle={{borderColor:'yellow'}}
            showTime={true}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:'15%',
        
    
  },
  buttonContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
  },
  scroller: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  month: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  monthText:{
    color: "#4186f5"
  }
});

export default MonthlyScreen;
