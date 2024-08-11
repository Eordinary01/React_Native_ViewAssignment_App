import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { REACT_APP_API_URL } from '@env';

const EditModal = ({ visible, assignment, onClose, onComplete,token }) => {
  const [editedAssignment, setEditedAssignment] = useState(assignment);

  const handleChange = (key, value) => {
    setEditedAssignment(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    console.log("Token in EditModal:", token);
    try {
      const response = await fetch(`${REACT_APP_API_URL}/assignments/assignments/${assignment._id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedAssignment)
    });
    // console.log(token)

      if (response.ok) {
        const updatedAssignment = await response.json();
        onComplete(updatedAssignment);
      } else {
        throw new Error('Failed to update the assignment.');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
      console.error('Update error:', err);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Assignment</Text>
          <TextInput
            style={styles.input}
            value={editedAssignment.subject}
            onChangeText={(text) => handleChange('subject', text)}
            placeholder="Subject"
          />
          <TextInput
            style={styles.input}
            value={editedAssignment.course}
            onChangeText={(text) => handleChange('course', text)}
            placeholder="Course"
          />
          <TextInput
            style={styles.input}
            value={editedAssignment.branch}
            onChangeText={(text) => handleChange('branch', text)}
            placeholder="Branch"
          />
          <TextInput
            style={styles.input}
            value={editedAssignment.year}
            onChangeText={(text) => handleChange('year', text)}
            placeholder="Year"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Icon name="close" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Icon name="check" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6200EE',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#D32F2F',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default EditModal;