import React, { useState,useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_API_URL } from '@env';
import { AuthContext } from '../App';
import FooterMenu from './menus/FooterMenu';
import Icon from 'react-native-vector-icons/Ionicons'; 

const UploadAssignment = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);

  const [course, setCourse] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelection = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setFile(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        console.log('Unknown error:', err);
      }
    }
  };

  const handleSubmit = async () => {
    if (!course || !branch || !year || !subject || !file) {
      Alert.alert('Please fill in all fields and select a file.');
      return;
    }

    const token = await AsyncStorage.getItem('userToken');
    console.log('Retrieved Token:', token); // Debugging token retrieval

    if (!token) {
      console.log('No token found, signing out');
      signOut();
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('course', course.toUpperCase());
    formData.append('branch', branch.toUpperCase());
    formData.append('year', year.toUpperCase());
    formData.append('subject', subject.toUpperCase());
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    });

    try {
      const response = await fetch(`${REACT_APP_API_URL}/assignments/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', responseText);

      if (response.ok) {
        Alert.alert('Assignment uploaded successfully');
        navigation.navigate('Home');
      } else {
        let error;
        try {
          error = JSON.parse(responseText);
        } catch (e) {
          error = { error: responseText };
        }
        Alert.alert('Failed to upload assignment', error.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Failed to upload assignment', 'Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Assignment</Text>
      
      <View style={styles.inputContainer}>
        <Icon name="book-outline" size={20} color="#6C5CE7" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholderTextColor="black"
          placeholder="Course"
          value={course}
          onChangeText={setCourse}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="school-outline" size={20} color="#6C5CE7" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Branch"
           placeholderTextColor="black"
          value={branch}
          onChangeText={setBranch}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="calendar-outline" size={20} color="#6C5CE7" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Year"
           placeholderTextColor="black"
          value={year}
          onChangeText={setYear}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="clipboard-outline" size={20} color="#6C5CE7" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Subject"
           placeholderTextColor="black"
          value={subject}
          onChangeText={setSubject}
        />
      </View>

      <TouchableOpacity style={styles.fileButton} onPress={handleFileSelection}>
        <Text style={styles.fileButtonText}>
          {file ? (
            <>
              <Icon name="document-outline" size={20} color="white" /> {file.name}
            </>
          ) : (
            'Select File'
          )}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitButton, isLoading && { backgroundColor: '#d3d3d3' }]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Assignment</Text>
        )}
      </TouchableOpacity>

      <FooterMenu/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  inputIcon: {
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    color:"#1c262e"
  },
  fileButton: {
    backgroundColor: '#6C5CE7',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  fileButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#0984e3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UploadAssignment;
