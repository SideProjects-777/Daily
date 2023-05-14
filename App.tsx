import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/HomeScreen';
import NewEvent from './src/NewEvent';
import MonthAgenda from './src/Monthly';

const Stack = createStackNavigator();

export default class App extends Component {
    render() {
    return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Monthly'>
        <Stack.Screen name='Monthly' component={MonthAgenda} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Add" component={NewEvent} options={{headerShown: false}}/>
        </Stack.Navigator>
    </NavigationContainer>
    );
    }
}