import React, {Component} from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    Animated,
    Easing,
    View,
    TouchableOpacity
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionButton from 'react-native-action-button';
import {SafeAreaProvider} from "react-native-safe-area-context";
import Completed from './body/Completed';
import NotCompletePassed from './body/NotCompletePassed';
import NotCompletedFuture from './body/NotCompletedFuture';
import NotCompleteCurrent from './body/NotCompleteCurrent';

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
    items : Record < string,
    Item[] >;
    loadedKeys : string[];
}

export default class HomeScreen extends Component < any,
State > {
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
                const ourDate = this.parseDateIntoStringAndVice(parsedJSON.date);

                if (!this.state.items[ourDate]) {
                    this.state.items[ourDate] = [];
                }

                var item : Item = {
                    start: parsedJSON.start,
                    end: parsedJSON.end,
                    name: parsedJSON.name,
                    description: parsedJSON.description,
                    height: 100, // parsedJSON.height,
                    // Math.max(50, Math.floor(Math.random() * 150)),
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

    //not used
    getData = async(key : string) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                //this.setState({ storedValue: value });
            }
        } catch (e) {
            console.error('Error reading value from AsyncStorage');
        }
    };

    clean = async() => {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error(error)
        }
    }

    updateData = async(key : string, data : any) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data),);
        } catch (error) {
            console.error(error)
        }
    }

    deleteFromStorage = async(key : string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error(error)
        }
    }

    loadDataSet = async() => {
        this.setState({loading: true});
        let items : {
            [key : string] : any[]
        } = {};
        // Initialize items object
        let today = new Date();
        for (let i = 1; i < 365; i++) {
            today.setDate(today.getDate() + 1);
            let val = this.parseDateIntoStringAndVice(today);
            if (!items[val]) {
                items[val] = [];
            }
        }
        today = new Date();
        for (let i = 1; i < 365; i++) {
            today.setDate(today.getDate() - 1);
            let val = this.parseDateIntoStringAndVice(today);
            if (!items[val]) {
                items[val] = [];
            }
        }

        // Import data from AsyncStorage
        try {
            const keys = await AsyncStorage.getAllKeys();
            if (keys.length === 0) {
                this.setState({items: undefined});
                this.setState({loading: false});
                return;
            }
            this.setState({loadedKeys: keys});

            let timestamps : number[] = [];

            for (const key of keys) {
                const value = await AsyncStorage.getItem(key);
                const parsedJSON = JSON.parse(value !);
                let timestamp = new Date(parsedJSON.date).getTime();
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

            // Get the timestamps of the earliest and latest events and initialize state
            // with items object
            const earliestTimestamp = Math.min(...timestamps);
            const latestTimestamp = Math.max(...timestamps);
            this.setState({items: items, earliestDate: earliestTimestamp, latestDate: latestTimestamp});
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
                loadItemsForMonth={this.loadItemsForMonth}
                selected={this.state.today}
                renderItem={this.renderItem}
                renderEmptyDate={this.renderEmptyDate}
                rowHasChanged={this.rowHasChanged}
                showClosingKnob={true}
                monthFormat={'MMMM' + ' - ' + 'yyyy'}
                reservationsKeyExtractor={this.reservationsKeyExtractor}
              />
              <ActionButton
                useNativeDriver={false}
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

      // totally loadout
      

}