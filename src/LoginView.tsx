import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Button} from 'react-native';
import * as Google from 'expo-google-app-auth';

const CLIENT_ID = 'test';
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

    handleSignIn = async () => {
        try {
          const result = await Google.logInAsync({
            clientId: CLIENT_ID,
            scopes: [CALENDAR_SCOPE],
          });
    
          if (result.type === 'success') {
            const accessToken = result.accessToken;
    
            const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
    
            const data = await response.json();
            this.setState({ calendars: data.items });
          }
        } catch (error) {
          console.error(error);
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

                    <TouchableOpacity onPress={this.handleSignIn} style={styles.button}>
                            <Text style={styles.buttonText}>Sign In</Text>
                        </TouchableOpacity>
                        {calendars.map(calendar => (
                        <Text key={calendar.id}>{calendar.summary}</Text>
                        ))}

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