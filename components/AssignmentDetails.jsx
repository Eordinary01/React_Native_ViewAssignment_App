import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { REACT_APP_API_URL } from '@env';
import RNFS from 'react-native-fs';
import FooterMenu from './menus/FooterMenu';
import EditModal from './menus/EditModal';

const AssignmentDetails = ({ route, navigation}) => {
  const { assignment, userRole,token } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = async () => {
    Alert.alert(
      'Delete Assignment',
      'Are you sure you want to delete this assignment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            setIsLoading(true);
            try {
              const response = await fetch(`${REACT_APP_API_URL}/assignments/assignments/${assignment._id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                }
              });
              
              if (response.ok) {
                Alert.alert('Success', 'Assignment deleted successfully.');
                navigation.goBack();
              } else {
                throw new Error('Failed to delete the assignment.');
              }
            } catch (err) {
              Alert.alert('Error', err.message);
              console.error('Delete error:', err);
            } finally {
              setIsLoading(false);
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${REACT_APP_API_URL}${assignment.fileUrl}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download the assignment.');
      }

      const fileName = assignment.fileUrl.split('/').pop();
      const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      const fileData = await response.text();
      await RNFS.writeFile(path, fileData, 'utf8');

      Alert.alert('Success', `File downloaded successfully to ${path}`);
    } catch (err) {
      Alert.alert('Error', err.message);
      console.error('Download error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const onEditComplete = (updatedAssignment) => {
    // Handle the updated assignment data here
    // You might want to update the local state or refetch the assignment
    setShowEditModal(false);
    Alert.alert('Success', 'Assignment updated successfully');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{assignment.subject}</Text>
        <View style={styles.card}>
          <DetailItem icon="school" label="Course" value={assignment.course} />
          <DetailItem icon="account-tree" label="Branch" value={assignment.branch} />
          <DetailItem icon="business" label="College" value={assignment.college} />
          <DetailItem icon="event" label="Year" value={assignment.year} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleDownload} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Icon name="cloud-download" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Download Assignment</Text>
            </>
          )}
        </TouchableOpacity>

        {userRole === 'admin' && (
          <>
            <TouchableOpacity style={styles.button} onPress={handleEdit}>
              <Icon name="edit" size={24} color="#6fa8dc" />
              <Text style={styles.buttonText}>Edit Assignment</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#6fa8dc" />
              ) : (
                <>
                  <Icon name="delete" size={24} color="#6fa8dc" />
                  <Text style={styles.buttonText}>Delete Assignment</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Back to Assignments</Text>
        </TouchableOpacity>
      </ScrollView>
      <FooterMenu />
      <EditModal 
        visible={showEditModal}
        assignment={assignment}
        onClose={() => setShowEditModal(false)}
        onComplete={onEditComplete}
        token={token}
      />
    </View>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <View style={styles.detailItem}>
    <Icon name={icon} size={24} color="#6200EE" />
    <View style={styles.detailText}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#6200EE',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    marginLeft: 10,
    flex: 1,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#191970',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 2,
  },
  buttonText: {
    color: '#8fbee9',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
  },
});

export default AssignmentDetails;