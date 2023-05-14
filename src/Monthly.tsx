import React from 'react';
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

class Monthly extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Button 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Button 2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Button 3</Text>
          </TouchableOpacity>
        </View>
        <ScrollView nestedScrollEnabled={true} horizontal={false}>

        <View style={styles.scroller}>
          <TouchableOpacity style={styles.button}>
          <FontAwesome name="step-backward" size={22} color="green" />
          </TouchableOpacity>
          <View style={styles.month}>
            <Text style={styles.monthText}>Button 2</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <FontAwesome name="step-forward" size={22} color="green" />
          </TouchableOpacity>
        </View>
          <Calendar
            mode={'month'}
            events={events}
            height={windowHeight- 200}
            swipeEnabled={true}
            
            onPressCell={(date: Date) => console.log(date)}
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
  scroller: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
  },
  button: {
    backgroundColor: '#ccc',
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

  }
});

export default Monthly;
