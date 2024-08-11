import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AuthContext } from '../../App';

const HeaderMenu = ({ title }) => {
  const navigation = useNavigation();
  const { signOut } = useContext(AuthContext);

  const handleLogout = async () => {
    await signOut();
    
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />
      
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.rightIcons}>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.iconButton}>
          <Icon name="bell" size={24} color="#ffdd40" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <Icon name="sign-out-alt" size={24} color="#e50000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4A90E2',
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
   
  },
  iconButton: {
    marginLeft: 15,
    padding: 8,
    
  },
});

export default HeaderMenu;