import React, { useState, useEffect, useContext } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet } from 'react-native';
import Login from './screens/auth/Login';
import Register from './screens/auth/Register';
import Home from './screens/Home';
import AssignmentDetails from './components/AssignmentDetails';
import UploadAssignment from './components/UploadAssignment';
import HeaderMenu from './components/menus/HeaderMenu';

const Stack = createNativeStackNavigator();

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Consistent key
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (token) => {
    try {
      await AsyncStorage.setItem('userToken', token); // Consistent key
      console.log('Token stored successfully:', token);
      setIsAuthenticated(true); 
    } catch (error) {
      console.error('Error storing the token:', error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); // Consistent key
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthenticatedStack = () => (
  <Stack.Navigator
    screenOptions={({ route }) => ({
      header: () => <HeaderMenu title={route.name} />,
    })}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="AssignmentDetails" component={AssignmentDetails} />
    <Stack.Screen name="UploadAssignment" component={UploadAssignment} />
  </Stack.Navigator>
);

const UnauthenticatedStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
  </Stack.Navigator>
);

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {isAuthenticated ? <AuthenticatedStack /> : <UnauthenticatedStack />}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
