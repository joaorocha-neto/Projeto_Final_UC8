import React from 'react';
import { useAuth } from '../services/authContext';
import BottomTabs from './BottomTabs';
import LoginScreen from '../screens/LoginScreen';
import { View, ActivityIndicator } from 'react-native';

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return isAuthenticated ? <BottomTabs /> : <LoginScreen />;
};

export default AppNavigator;