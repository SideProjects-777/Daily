import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function NotCompletePassed(props) {
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
            backgroundColor: 'red',
            transform: [{rotate: '45deg'}],
            }}
        />
        <Text style={{color: 'white', fontSize: 15, fontWeight: 'bold'}}>
            <MaterialCommunityIcons name="bell" color='white' size={15} />
        </Text>
        </View>
        <Text style={{ fontSize:18,color:'black'}}>{props.data.start} - {props.data.end}</Text>
        <Text style={{ fontSize:16,color:'black'}}>{props.data.name}</Text>
        <Text style={{ fontSize:14,color:'black'}}>{props.data.description}</Text>
    </>
    );
  }
  
  export default NotCompletePassed;  