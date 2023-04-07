import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


function Completed(props) {
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
            backgroundColor: '#00b9f7',
            transform: [{rotate: '45deg'}],
            }}
        />
        <Text style={{color: 'white', fontSize: 15, fontWeight: 'bold'}}>
            <MaterialCommunityIcons name="check-outline" color='white' size={15} />
        </Text>
        </View>
        <View style={styles.container}>
        <Text style={{ fontSize:18,color:'grey',textDecorationLine: 'line-through'}}>{props.data.start} - {props.data.end}</Text>
        <Text style={{ fontSize:16,color:'grey',textDecorationLine: 'line-through'}}>{props.data.name}</Text>
        <Text style={{ fontSize:14,color:'grey',textDecorationLine: 'line-through'}}>{props.data.description}</Text>
        </View>
    </>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
    }
  });
  

  
  export default Completed;