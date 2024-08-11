import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

import { REACT_APP_API_URL } from "@env";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${REACT_APP_API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Signup successful! Redirecting to login...');
        setIsError(false);
        setTimeout(() => navigation.navigate('Login'), 2000);
      } else {
        setMessage(data.error || 'An error occurred during signup.');
        setIsError(true);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setMessage('An error occurred during signup.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        setIsError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const inputFields = [
    { name: 'name', icon: 'user' },
    { name: 'email', icon: 'mail' },
    { name: 'password', icon: 'lock' },
    { name: 'college', icon: 'home' },
  ];

  return (
    <LinearGradient colors={['#8B5CF6', '#4F46E5']} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Join Us</Text>
        {inputFields.map(({ name, icon }) => (
          <View key={name} style={styles.inputContainer}>
            <Icon name={icon} size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
              value={formData[name]}
              onChangeText={text => handleInputChange(name, text)}
              secureTextEntry={name === 'password'}
            />
          </View>
        ))}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Sign Up</Text>
              <Icon
                name="arrow-right"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
            </View>
          )}
        </TouchableOpacity>
        {message ? (
          <View
            style={[
              styles.messageContainer,
              isError ? styles.errorMessage : styles.successMessage,
            ]}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}
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
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
    color: '#9CA3AF',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonIcon: {
    marginLeft: 10,
  },
  messageContainer: {
    marginTop: 15,
    padding: 10,
    borderRadius: 5,
  },
  successMessage: {
    backgroundColor: '#D1FAE5',
  },
  errorMessage: {
    backgroundColor: '#FEE2E2',
  },
  messageText: {
    textAlign: 'center',
    color: '#065F46',
  },
});

export default Register;
