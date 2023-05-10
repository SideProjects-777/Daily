import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Button} from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';


const event = {
    summary: 'Test Event',
    start: {
      dateTime: '2023-05-11T10:00:00',
      timeZone: 'Europe/Berlin', // e.g., 'America/Los_Angeles'
    },
    end: {
      dateTime: '2023-05-11T12:00:00',
      timeZone: 'Europe/Berlin', // e.g., 'America/Los_Angeles'
    },
};


const CLIENT_ID = '';
//const CLIENT_ID = ;
//const CLIENT_SECRET = '';
const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar';




interface State {
    email : string;
    password : string;
    calendars: [];
}

class LoginView extends Component < {},State > {
    constructor(props : {}) {
        super(props);
        this.state = {
            email: '',
            password: '',
            calendars: []
        };
    }


    componentDidMount(): void {
        console.log(CLIENT_ID);
        GoogleSignIn.initAsync({
            clientId: CLIENT_ID,
        });
        
    }



    handleGoogleSignIn = async () => {
        try {
          await GoogleSignIn.askForPlayServicesAsync();
          const { type, user } = await GoogleSignIn.signInAsync();
          
          if (type === 'success') {
            console.log('User Info:', user);
            // Handle successful sign-in here
          } else {
            console.log('Google sign-in cancelled');
          }
        } catch (error) {
          console.error('Google sign-in error:', error);
        }
      };

    

    handleEmailChange = (text : string) => {
        this.setState({email: text});
    };

    handlePasswordChange = (text : string) => {
        this.setState({password: text});
    };

    handleLoginPress = () => {
        // Perform login logic here
    };

    handleProceed = () => {
        this.props.navigation.navigate('Home');
    };

    render() {
        const {email, password, calendars} = this.state;
        return (
            <View style={styles.container}>
                <Image
                    source={require('../assets/background.jpg')}
                    style={styles.background}
                />
                <View style={styles.card}>
                    <Text style={styles.title}>Gmail</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={this.handleEmailChange}/>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={this.handlePasswordChange}
                        secureTextEntry/>
                    <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={this.handleLoginPress}>
                        <Text style={styles.buttonText}>Connect</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={this.handleProceed}>
                        <Text style={styles.buttonText}>Local</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={this.handleGoogleSignIn}>
                        <Text style={styles.buttonText}>GGGG</Text>
                    </TouchableOpacity>

                    </View>
                </View>
            </View>
        );
    }
}

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    background: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    card: {
        alignItems: 'center',
        backgroundColor: '#e5effb',
        //opacity:0.1,
        borderRadius: 10,
        padding: 20,
        width: '80%'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderBottomColor: '#999',
        borderBottomWidth: 1,
        marginBottom: 20,
        padding: 10,
        width: '90%'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    button: {
        backgroundColor: '#0066cc',
        borderRadius: 5,
        padding: 10,
        width: '33%'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
    }
});

export default LoginView;