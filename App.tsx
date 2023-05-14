import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import WeeklyScreen from './src/WeeklyScreen';
import NewEvent from './src/NewEvent';
import MonthlyScreen from './src/MonthlyScreen';

const Stack = createStackNavigator();

export default class App extends Component {
    render() {
    return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Monthly'>
        <Stack.Screen name='Monthly' component={MonthlyScreen} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={WeeklyScreen} />
        <Stack.Screen name="Add" component={NewEvent} options={{headerShown: false}}/>
        </Stack.Navigator>
    </NavigationContainer>
    );
    }
}