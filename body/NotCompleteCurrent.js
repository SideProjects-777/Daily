import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';



function NotCompleteCurrent(props) {
    return (
<TouchableOpacity
  onPress={() => this.createCompletness(propsreservation)} 
  style={{
    width: '95%',
    height: 100,
    marginBottom:10,
    marginTop:5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 20,
    overflow: 'hidden',
  }}>
    <Text style={{color: 'white', fontSize: 15, fontWeight: 'bold', marginTop: 10}}>
      {reservation.start} - {reservation.end}
    </Text>
    <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
      {reservation.name}
    </Text>
    <Text style={{color: 'white', fontSize: 15}}>
      {reservation.description}
    </Text>  
</TouchableOpacity>
    );
  }
  

  
  export default NotCompleteCurrent;