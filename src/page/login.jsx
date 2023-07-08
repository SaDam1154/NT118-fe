import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native';

export const Login = () => {
    const [islogged, setIsLogged] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    return (
        <View style={styles.container}>
            {!islogged ? (
                <>
                    <Text style={styles.text}>Username:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => {
                            setUsername(text);
                        }}
                    ></TextInput>
                    <Text style={styles.text}>Password:</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            setPassword(text);
                        }}
                    />
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            // setBMI(weight / (height*height));
                            if (username && password) {
                                if (username === 'user' && password === '123456') setIsLogged(true);
                                else setMessage('Wrong username or password');
                            } else {
                                setMessage('Please enter username and password');
                            }
                        }}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.success}>Login Success</Text>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15,
    },
    text: {
        justifyContent: 'flex-start',
        fontSize: 20,
        alignSelf: 'flex-start',
        padding: 10,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        width: '100%',
        padding: 10,
        height: 60,
        backgroundColor: 'grey',
        color: 'white',
        borderRadius: 4,
    },
    message: {
        alignSelf: 'center',
        padding: 25,
        fontSize: 20,
        color: 'red',
    },
    button: {
        backgroundColor: 'grey',
        width: '40%',
        height: 50,
        borderRadius: 6,
        justifyContent: 'center',
    },
    buttonText: {
        alignSelf: 'center',
        fontSize: 25,
        color: 'white',
    },
    success: {
        fontSize: 30,
        padding: 10,
        fontWeight: 'bold',
    },
});
