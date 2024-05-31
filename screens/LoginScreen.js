import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL } from '@env';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    setUsernameError('');
    setPasswordError('');
    if (username.trim() === '') {
      setUsernameError('Username is required');
      return;
    }
    else if(username.trim().length < 6){
      setUsernameError('Username must be at least 6 characters');
      return;
    }

    if (password.trim() === '') {
      setPasswordError('Password is required');
      return;
    }
    else if(password.trim().length < 6){
      setUsernameError('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/signin`, { username, password });
      const { token } = response.data;
      await AsyncStorage.setItem('token', token);
      navigation.navigate('Todo');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./todo.png')} // Update with your logo image path
        style={styles.logo}
      />
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        keyboardType="username"
      />
      {usernameError !== '' && <Text style={styles.errorText}>{usernameError}</Text>}
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      {passwordError !== '' && <Text style={styles.errorText}>{passwordError}</Text>}
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', // Set the background color of your app
  },
  logo: {
    width: 300, // Set your desired width
    height: 150, // Set your desired height
    marginBottom: 20, // Adjust the spacing as needed
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 8, // Adjust the margin as needed
  },
});
