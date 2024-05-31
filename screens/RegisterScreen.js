import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '@env';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameErrors, setUsernameErrors] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);

  const handleRegister = async () => {
    setUsernameErrors([]);
    setPasswordErrors([]);

    const newUsernameErrors = [];
    const newPasswordErrors = [];

    if (username.trim() === '') {
      newUsernameErrors.push('Username is required');
    }

    if (password.trim() === '') {
      newPasswordErrors.push('Password is required');
    }

    if (newUsernameErrors.length > 0 || newPasswordErrors.length > 0) {
      setUsernameErrors(newUsernameErrors);
      setPasswordErrors(newPasswordErrors);
      return;
    }

    try {
      await axios.post(`${SERVER_URL}/signup`, { username, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      navigation.navigate('Login');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data.errors) {
            for (let err of error.response.data.errors) {
              if (err.path === "username") newUsernameErrors.push(err.msg);
              if (err.path === "password") newPasswordErrors.push(err.msg);
            }
            setUsernameErrors(newUsernameErrors);
            setPasswordErrors(newPasswordErrors);
          }
        }
      } else {
        console.error('Error registering:', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./todo.png')} // Update with your image path
        style={styles.logo}
      />
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      {usernameErrors.length > 0 && usernameErrors.map((error, index) => (
        <Text key={index} style={styles.errorText}>{error}</Text>
      ))}
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      {passwordErrors.length > 0 && passwordErrors.map((error, index) => (
        <Text key={index} style={styles.errorText}>{error}</Text>
      ))}
      <View style={styles.buttonContainer}>
        <Button title="Register" onPress={handleRegister} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
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
  },
  logo: {
    width: 250, 
    height: 120, 
    marginBottom: 20, 
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 8, 
  },
});
