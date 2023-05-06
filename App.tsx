import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/HomeScreen';
import NewEvent from './src/NewEvent';

const Stack = createStackNavigator();

export default class App extends Component {
    render() {
    return (
    <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Add" component={NewEvent} options={{headerShown: false}}/>
        </Stack.Navigator>
    </NavigationContainer>
    );
    }
}