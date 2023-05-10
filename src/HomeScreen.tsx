import React, {Component, ReactNode} from 'react';
import { Alert, Text, View, TouchableOpacity} from 'react-native';
import {Agenda} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StorageService from './service/StorageService';
import HomeScreenService from './service/HomeScreenService';

import ActionButton from 'react-native-action-button';
import {SafeAreaProvider} from "react-native-safe-area-context";
import Completed from './types/Completed';
import NotCompletePassed from './types/NotCompletePassed';
import NotCompletedFuture from './types/NotCompletedFuture';
import NotCompleteCurrent from './types/NotCompleteCurrent';
import { AgendaEntry, DateData, DayAgenda } from 'react-native-calendars/src/types';

export interface Item {
    start : string;
    end : string;
    name : string;
    description : string;
    height : number;
    completed : boolean;
    date : string;
    day : string;
    key : string;
}

interface State {
    today : Date;
    items : Record < string, Item[] >;
}

export default class HomeScreen extends Component < any, State > {
    

    constructor(props : {}) {
        super(props);
        this.state = {
            today: new Date(),
            items: {},
        };
    }

    componentDidMount() {
        this.loadDataSet();
    }



    componentDidUpdate(prevProps: any) {
      const { route } = this.props;
      if (route && route.params) {
        const completed = route.params;
        if (completed) {
          this.loadDataSet();
          this.props.route.params = undefined;
        }
      }
    }
    

    loadDataSet = async() => {
        let items : { [key : string] : any[] } = {};
        this.setState({items:{}})
        try {
            const keys = await AsyncStorage.getAllKeys();
            if (keys.length === 0) {
                var today = HomeScreenService.parseDateIntoStringAndVice(new Date());
                items[today] = [];
                this.setState({items: items});
                return;
            }

            items = HomeScreenService.loopInGivenMonth(items, new Date());

            for (const key of keys) {
                const value = await AsyncStorage.getItem(key);
                const parsedJSON = JSON.parse(value !);
                var ourDate = HomeScreenService.parseDateIntoStringAndVice(parsedJSON.date);

                if (!items[ourDate]) {
                    items[ourDate] = [];
                }

                items[ourDate].push({
                    start: parsedJSON.start,
                    end: parsedJSON.end,
                    name: parsedJSON.name,
                    description: parsedJSON.description,
                    height: 100,
                    completed: parsedJSON.completed,
                    date: parsedJSON.date,
                    day: parsedJSON.date,
                    key: key
                });
                items[ourDate].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            }
            var today = HomeScreenService.parseDateIntoStringAndVice(new Date());
            if(items[today]==undefined){
              items[today] = [];
            }
            this.setState({items: items});
        } catch (error) {
            console.error(error);
        } finally {
            //this.setState({loading: false});
        }
    }

    render(): React.ReactNode {
          return (
            <SafeAreaProvider style={{ flex: 1 }}>
              <Agenda
                items={this.state.items}
                selected={this.state.today.toISOString()}
                renderItem={this.renderItem}
                rowHasChanged={this.rowHasChanged}
                loadItemsForMonth={this.dateChanged}
                showClosingKnob={true}
                monthFormat={'MMMM' + ' - ' + 'yyyy'}
                renderEmptyDate={this.renderEmptyDate}
                reservationsKeyExtractor={this.reservationsKeyExtractor}
              />
              <ActionButton
                onPress={() => this.props.navigation.navigate('Add')}
              />
            </SafeAreaProvider>
          );
      }


    renderEmptyDate = ({date}:any) => {
        return (
          <View style={{
            height: 15,
            flex: 1,
            paddingTop: 50
          }}>
            <Text>Nothing planned</Text>
          </View>
        );
    }
    reservationsKeyExtractor = (item: DayAgenda, index: number) => {
        return `${item?.reservation?.day}${index}`;
    };
    
    
      deleteEvent = async (reservation: Item) => {
          Alert.alert('Do you want to remove the event?', reservation.name, [
            {
              text: 'Close',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Remove', onPress: () => {
              StorageService.delete(reservation.key);
              let {items} = this.state;
              let updKey = HomeScreenService.parseDateIntoStringAndVice(reservation.date);              
              items[updKey] = HomeScreenService.removeFromList(items[updKey],reservation.key);
              this.setState({items:items});
            }},
          ]);
    }

    createCompletness = (reservation: Item) =>{
        if(!reservation.completed){
          Alert.alert('Is this event completed?', reservation.name, [
            {
              text: 'Edit',
              onPress: () => this.props.navigation.navigate('Add', {reservation}),
              style: 'cancel',
            },
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Completed', onPress: () => {
              reservation.completed = true
              StorageService.updateData(reservation.key,reservation);
              this.loadDataSet();
            }},
          ]);
        }else{
          Alert.alert('Event became valid?', reservation.name, [
            {
              text: 'Edit',
              onPress: () => this.props.navigation.navigate('Add', {reservation}),
              style: 'cancel',
            },
            {
              text: 'Close',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Activate', onPress: () => {
              reservation.completed = false
              StorageService.updateData(reservation.key,reservation);
              this.loadDataSet();
            }},
          ]);
        }
      }
    


      renderItem = (reservation: Item, isFirst: boolean): ReactNode => {
        const now = new Date();
        const meetingStart = new Date(Date.parse(reservation.date));
        meetingStart.setHours(meetingStart.getHours() - 2);
        const meetingEnd = new Date(Date.parse(reservation.date));
        meetingEnd.setHours(meetingEnd.getHours() - 2);
      
        const time = reservation.end.split(":");
        meetingEnd.setHours(Number.parseInt(time[0]), Number.parseInt(time[1]));
      
        if (reservation.completed) {
          return (
            <TouchableOpacity
              onLongPress={() => this.deleteEvent(reservation)}
              onPress={() => this.createCompletness(reservation)}
              style={{
                width: '95%',
                height: reservation.height,
                marginBottom: 10,
                marginTop: 5,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              <Completed data={reservation} />
            </TouchableOpacity>
          );
        }
      
        if (now < meetingStart) {
          return (
            <TouchableOpacity
              onLongPress={() => this.deleteEvent(reservation)}
              onPress={() => this.createCompletness(reservation)}
              style={{
                width: '95%',
                height: reservation.height,
                marginBottom: 10,
                marginTop: 5,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              <NotCompletedFuture data={reservation} />
            </TouchableOpacity>
          );
        } else {
          if (now < meetingEnd) {
            return (
              <TouchableOpacity
                onLongPress={() => this.deleteEvent(reservation)}
                onPress={() => this.createCompletness(reservation)}
                style={{
                  width: '95%',
                  height: reservation.height,
                  marginBottom: 10,
                  marginTop: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  borderRadius: 20,
                  overflow: 'hidden',
                }}
              >
                <NotCompleteCurrent data={reservation} />
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                onLongPress={() => this.deleteEvent(reservation)}
                onPress={() => this.createCompletness(reservation)}
                style={{
                  width: '95%',
                  height: reservation.height,
                  marginBottom: 10,
                  marginTop: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  borderRadius: 20,
                  overflow: 'hidden',
                }}
              >
                <NotCompletePassed data={reservation} />
              </TouchableOpacity>
            );
          }
        }
      }
      
    
      rowHasChanged = (r1: AgendaEntry, r2:AgendaEntry) => {
        return r1.name !== r2.name;
      }

      dateChanged = (date: DateData) => {
        let {items} = this.state;
        items = HomeScreenService.loopInGivenMonth(items, new Date(date.dateString));
        this.setState({items: items});

      }    

}