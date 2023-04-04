import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


function NotCompletedFuture(props) {
    return (
    <>
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
            <MaterialCommunityIcons name="calendar-today" color='white' size={15} />
        </Text>
        </View>
        <Text style={{ fontSize:18,color:'grey'}}>{props.data.start} - {props.data.end}</Text>
        <Text style={{ fontSize:16,color:'grey'}}>{props.data.name}</Text>
        <Text style={{ fontSize:14,color:'grey'}}>{props.data.description}</Text>
    </>
    );
  }
  
  export default NotCompletedFuture;  