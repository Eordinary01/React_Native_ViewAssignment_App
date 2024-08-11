import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure you have react-native-vector-icons installed

const FooterMenu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = Dimensions.get('window'); // Get the full width of the screen

  // Function to determine if the current route matches the button's route
  const isRouteActive = (routeName) => route.name === routeName;

  return (
    <View style={[styles.footerContainer, { width }]}>
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Icon
          name="home-outline"
          size={24}
          color={isRouteActive('Home') ? '#FF5733' : '#082325'} // Active color vs inactive color
        />
        <Text
          style={[
            styles.footerButtonText,
            { color: isRouteActive('Home') ? '#FF5733' : '#082325' },
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => navigation.navigate('UploadAssignment')}
      >
        <Icon
          name="cloud-upload-outline"
          size={24}
          color={isRouteActive('UploadAssignment') ? '#FF5733' : '#082325'}
        />
        <Text
          style={[
            styles.footerButtonText,
            { color: isRouteActive('UploadAssignment') ? '#FF5733' : '#082325' },
          ]}
        >
          Upload
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Icon
          name="person-outline"
          size={24}
          color={isRouteActive('Profile') ? '#FF5733' : '#082325'}
        />
        <Text
          style={[
            styles.footerButtonText,
            { color: isRouteActive('Profile') ? '#FF5733' : '#082325' },
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Icon
          name="settings-outline"
          size={24}
          color={isRouteActive('Settings') ? '#FF5733' : '#082325'}
        />
        <Text
          style={[
            styles.footerButtonText,
            { color: isRouteActive('Settings') ? '#FF5733' : '#082325' },
          ]}
        >
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#d7fafd',
    paddingVertical: 10,
  },
  footerButton: {
    alignItems: 'center',
    flex: 1, // This makes each button take equal space
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4, // Add space between icon and text
  },
});

export default FooterMenu;
