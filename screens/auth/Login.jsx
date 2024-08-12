import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import {Animated} from 'react-native';
import {REACT_APP_API_URL} from '@env';
import {AuthContext} from '../../App';

const Login = () => {
  const [formData, setFormData] = useState({email: '', password: ''});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const {signIn, isAuthenticated} = useContext(AuthContext);

  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }
  }, [isAuthenticated, navigation]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

 

  const fadeMessageIn = () => {
    console.log('Fading message in:', message);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  
  const fadeMessageOut = () => {
    console.log('Scheduling message fade out');
    setTimeout(() => {
      console.log('Fading message out:', message);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        console.log('Message fade out complete');
        setMessage('');
      });
    }, 5000);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage('');
    console.log('Submitting login form...');

    try {
      console.log('Sending request to:', `${REACT_APP_API_URL}/auth/login`);
      const res = await fetch(`${REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      if (res.ok) {
        console.log('Login successful, signing in...');
        await signIn(data.token);
        setMessage('Login successful!');
      } else {
        console.log('Login failed');
        setMessage(data.message || 'Login failed. Please verify credentials.');
      }
    } catch (err) {
      console.error('Network error:', err);
      setMessage('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
      console.log('Final message:', message);
      fadeMessageIn();
      fadeMessageOut();
    }
  };

  return (
    <LinearGradient colors={['#3498db', '#8e44ad']} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={text => handleInputChange('email', text)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={text => handleInputChange('password', text)}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <View style={styles.messageContainer}>
          <Animated.Text style={[styles.message, {opacity: fadeAnim}]}>
            {message}
          </Animated.Text>
          <Text style={styles.debugMessage}>{message}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.loginLink}>
            Dont have an account? Register here
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: '#1c262e',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 15,
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16, // Added to make the text more visible
  },
  loginLink: {
    marginTop: 15,
    color: 'red',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  messageContainer: {
    marginTop: 15,
    minHeight: 40, // Ensure there's always space for the message
  },
  debugMessage: {
    color: 'red',
    textAlign: 'center',
  },
});

export default Login;
