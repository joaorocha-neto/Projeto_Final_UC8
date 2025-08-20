import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { TextInput } from 'react-native';


type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-blue-50 justify-center ">
      <View className='shadow-xl bg-white border border-gray-300 rounded-xl py-32 m-8'>
        <Text className='bottom-10 color-gray-800 font-poppinsBold text-4xl text-nowrap text-center h-12'>Login</Text>
        <View className=''>
            <Text className='mx-5 text-lg font-poppinsBold h-8'>Email:</Text>
            <TextInput
                className="bg-white px-6 mx-5 rounded-xl border border-gray-200 shadow"
                placeholder="Digite seu Email..."
                placeholderTextColor="#888"   
            />
            <Text className='mt-7 mx-5 text-lg font-poppinsBold h-8'>Senha:</Text>
            <TextInput
                className="bg-white px-6 mx-5 rounded-xl border border-gray-200 shadow"
                placeholder="Digite sua senha..."
                placeholderTextColor="#888"
                secureTextEntry={true}  
            />

        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Settings')} className='bg-blue-700 px-16 py-3 mt-7 self-center items-center rounded-lg'>
          <Text className='color-white font-bold text-xl'>Enviar</Text>
        </TouchableOpacity>

        

      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;


