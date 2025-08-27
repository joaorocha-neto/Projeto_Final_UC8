import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabNavigationProp } from '../navigation/types';

interface HomeScreenProps {
  navigation: TabNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      
    </SafeAreaView>
  );
};

export default HomeScreen;
