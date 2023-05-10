import React, { FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  data: {
    start: string;
    end: string;
    name: string;
    description: string;
  };
};

const NotCompleteCurrent: FC<Props> = ({ data }) => {

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
              transform: [{ rotate: '45deg' }],
            }}
          />
          <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>
            <MaterialCommunityIcons name="update" color='white' size={15} />
          </Text>
        </View>
        <Text style={{ fontSize:18,color:'black'}}>{data.start} - {data.end}</Text>
        <Text style={{ fontSize: 16, color: 'black' }}>{data.name}</Text>
        <Text style={{ fontSize: 14, color: 'black' }}>{data.description}</Text>
      </>
    );
  };


  export default NotCompleteCurrent;
  
