import React, {Component, ReactNode} from 'react';
import { Alert, StyleSheet, Text, Animated, Easing, View, TouchableOpacity} from 'react-native';
import {Agenda} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageService from './service/StorageService';
import ActionButton from 'react-native-action-button';
import {SafeAreaProvider} from "react-native-safe-area-context";
import Completed from './types/Completed';
import NotCompletePassed from './types/NotCompletePassed';
import NotCompletedFuture from './types/NotCompletedFuture';
import NotCompleteCurrent from './types/NotCompleteCurrent';
import { AgendaEntry, DayAgenda } from 'react-native-calendars/src/types';

interface Item {
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
    loading : boolean;
    items : Record < string, Item[] >;
    loadedKeys : string[];
}

export default class HomeScreen extends Component < any, State > {
    private spinValue = new Animated.Value(0);

    constructor(props : {}) {
        super(props);
        this.state = {
            today: new Date(),
            loading: false,
            items: {},
            loadedKeys: []
        };
    }

    componentDidMount() {
        this.loadDataSet();
        this.spin();
    }

    componentDidUpdate(prevProps : any) {
        const {route} = this.props;
        const {key} = route
            ?.params ?? {};
        const {loadedKeys} = this.state;

        if (key && key !== prevProps.route
            ?.params
                ?.key && !loadedKeys.includes(key)) {
            this.setState({loading: true});
            this
                .retrieveData(key)
                .then(() => {
                    this.setState({
                        loadedKeys: [
                            ...loadedKeys,
                            key
                        ],
                        loading: false
                    });
                })
                .catch((error) => {
                    console.error(error);
                    this.setState({loading: false});
                });
        }
    }

    retrieveData = async(key : string) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                const parsedJSON : Item = JSON.parse(value);
                const ourDate = this.parseDateIntoStringAndVice(new Date(parsedJSON.date));

                if (!this.state.items[ourDate]) {
                    this.state.items[ourDate] = [];
                }

                var item : Item = {
                    start: parsedJSON.start,
                    end: parsedJSON.end,
                    name: parsedJSON.name,
                    description: parsedJSON.description,
                    height: 100,
                    completed: parsedJSON.completed,
                    date: parsedJSON.date,
                    key: key,
                    day: parsedJSON.date
                }

                this
                    .state
                    .items[ourDate]
                    .push(item);
                this
                    .state
                    .items[ourDate]
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            }
        } catch (error) {
            console.error(error);
        }
    };

    spin() {
        this
            .spinValue
            .setValue(0);
        Animated
            .timing(this.spinValue, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: true
        })
            .start(() => this.spin());
    }

    loadDataSet = async() => {
        this.setState({loading: true});
        let items : {
            [key : string] : any[]
        } = {};
        try {
            const keys = await AsyncStorage.getAllKeys();
            if (keys.length === 0) {
                var today = this.parseDateIntoStringAndVice(new Date());
                items[today] = [];
                this.setState({items: items});
                this.setState({loading: false});
                return;
            }
            this.setState({loadedKeys: keys});

            let timestamps : number[] = [];

            for (const key of keys) {
                const value = await AsyncStorage.getItem(key);
                const parsedJSON = JSON.parse(value !);
                let timestamp = new Date(parsedJSON.date).getTime();
                console.log(parsedJSON.date);
                var ourDate = this.parseDateIntoStringAndVice(parsedJSON.date);

                timestamps.push(timestamp);

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
            this.setState({items: items});
        } catch (error) {
            console.error(error);
        } finally {
            this.setState({loading: false});
        }
    }

    render(): React.ReactNode {
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });
        const { loading } = this.state;
        if (!loading) {
          return (
            <SafeAreaProvider style={{ flex: 1 }}>
              <Agenda
                items={this.state.items}
                selected={this.state.today}
                renderItem={this.renderItem}
                rowHasChanged={this.rowHasChanged}
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
        } else {
            return (
                <View style={styles.container}>
                  <Animated.Text
                    style={[styles.logo, { transform: [{ rotate: spin }] }]}
                  >
                    Daily App
                  </Animated.Text>
                  <Text style={styles.text}>Loading...</Text>
                </View>
              );
        }
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

              let updKey = this.parseDateIntoStringAndVice(reservation.date);
              const isToday = new Date(updKey).toDateString() === new Date().toDateString();
              items[updKey] = isToday ? [] : undefined;
              this.setState({items:items});
            }},
          ]);
    }

    createCompletness = (reservation: Item) =>{
        if(!reservation.completed){
          Alert.alert('Is this event completed?', reservation.name, [
            {
              text: 'Close',
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
        meetingEnd.setHours(time[0], time[1]);
      
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
      
      parseDateIntoStringAndVice = (data: Date) => {
        const date = new Date(data);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        return formattedDate
      }
    
      rowHasChanged = (r1: AgendaEntry, r2:AgendaEntry) => {
        return r1.name !== r2.name;
      }
    
      timeToString(time:string) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
      }
      

}


const styles = StyleSheet.create({
    //beaty spinner
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff'
    },
    logo: {
      fontSize: 40,
      fontWeight: 'bold',
      color: '#333'
    },
    text: {
      marginTop: 20,
      fontSize: 20,
      color: '#333'
    }
  });