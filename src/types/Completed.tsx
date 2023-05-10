import React, {FC} from 'react';
import {View, Text, TouchableOpacity, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StorageService from '../service/StorageService';


interface Props {
    data : {
        start: string;
        end: string;
        name: string;
        description: string;
        key:string;
        timeless:boolean;
    }
}

const Completed : React.FC < Props > = ({ data }) => {


    return ( 
    <> 
        <View
            style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            right: 10,
            top: 10
        }}>
            <View
                style={{
                position: 'absolute',
                width: 120,
                height: 45,
                backgroundColor: 'green',
                transform: [{rotate: '45deg'}]
            }}/>
            <Text
                style={{
                color: 'white',
                fontSize: 15,
                fontWeight: 'bold'
            }}>
                <MaterialCommunityIcons name="check-outline" color="white" size={15}/>
            </Text>
        </View> 
        {!data.timeless ? (
          <><Text style={{ fontSize: 18, color: 'black' }}>{data.start} - {data.end}</Text><Text style={{ fontSize: 16, color: 'black' }}>{data.name}</Text><Text style={{ fontSize: 14, color: 'black' }}>{data.description}</Text></>
      ) : 
      <><Text style={{ fontSize: 18, color: 'black' }}>{data.name}</Text><Text style={{ fontSize: 16, color: 'black' }}>{data.description}</Text></>
      }      

    </>
    );
}


export default Completed;