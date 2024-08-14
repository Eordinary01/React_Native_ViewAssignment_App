import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_API_URL } from "@env";
import FooterMenu from '../components/menus/FooterMenu';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshControl } from 'react-native-gesture-handler';
import { AuthContext } from '../App';

const Home = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null); // Add token state
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserInfo = async () => {
    const storedToken = await AsyncStorage.getItem('userToken');
    console.log("Stored Token:", storedToken);
  
    if (!storedToken) {
        console.error('No token found. Please log in again.');
        return;
    }
  
    try {
      const response = await fetch(`${REACT_APP_API_URL}/auth/auth/user-info`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${storedToken}`,
            },
        });
  
        const resText = await response.text(); 
  
        if (!response.ok) {
            console.error(`Failed to fetch user information. Status: ${response.status}`);
            console.error('Error details:', resText); // Log the raw text response
            if (response.status === 401) {
                console.error('Invalid token. Logging out...');
                await signOut();
                return;
            }
        } else {
            const userData = JSON.parse(resText); // Parse the text response
            console.log('User data:', userData);
            setUserInfo(userData);
            setToken(storedToken); 
            fetchAssignments(storedToken, userData.role); 
        }
    } catch (error) {
        console.error('Failed to fetch user information:', error);
    }
  };
  


  const fetchAssignments = async (storedToken, role) => {
    try {
      let url = `${REACT_APP_API_URL}/assignments/assignments`;
      if (role === 'admin') {
        url += '?all=true';
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Assignments fetch successful:", data);
        setAssignments(data);
      } else {
        console.error('Failed to fetch assignments, response status:', response.status);
      }
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserInfo().then(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [])
  );

  const renderAssignment = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AssignmentDetails', { assignment: item, userRole: userInfo?.role, token })} 
    >
      <Text style={styles.cardTitle}>{item.subject}</Text>
      <Text style={{ fontSize: 17 }}>
        <Text style={{ color: '#2f4551' }}>{item.course}</Text>
        <Text style={{ color: "black" }}> - </Text>
        <Text style={{ color: '#139386' }}>{item.branch}</Text>
        <Text style={{ color: "black" }}> - </Text>
        <Text style={{ color: '#41414c' }}>{`${item.year} Year`}</Text>
        <Text style={{ color: "black" }}> - </Text>
        <Text style={{ color: '#0d47a1' }}>{item.college}</Text>
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4696fa" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assignments</Text>
      <FlatList
        data={assignments}
        renderItem={renderAssignment}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4696fa"]} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No assignments found. Pull down to refresh.</Text>
        }
      />
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#0d2158",
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4696fa',
    marginLeft: 10,
  },
  cardContent: {
    marginLeft: 34,
  },
  cardInfo: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

export default Home;
