import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';

interface State {
    email : string;
    password : string;
}

class LoginView extends Component < {},State > {
    constructor(props : {}) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    handleEmailChange = (text : string) => {
        this.setState({email: text});
    };

    handlePasswordChange = (text : string) => {
        this.setState({password: text});
    };

    handleLoginPress = () => {
        // Perform login logic here
    };

    render() {
        const {email, password} = this.state;
        return (
            <View style={{styles.container}}>
                <View style={styles.card}>
                    <Text style={styles.title}>Login</Text>
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
                    <TouchableOpacity style={styles.button} onPress={this.handleLoginPress}>
                        <Text style={styles.buttonText}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        alignItems: 'center',
        backgroundColor: '#eee',
        borderRadius: 10,
        padding: 20,
        width: '80%'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    input: {
        borderBottomColor: '#999',
        borderBottomWidth: 1,
        marginBottom: 20,
        padding: 10,
        width: '90%'
    },
    button: {
        backgroundColor: '#0066cc',
        borderRadius: 5,
        padding: 10,
        width: '90%'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
    }
};

export default LoginView;