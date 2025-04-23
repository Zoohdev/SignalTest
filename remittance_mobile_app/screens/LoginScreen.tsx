import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username: email,
        password: password
      });
      const { access } = response.data;
      await AsyncStorage.setItem('access_token', access);
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">Login</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} className="border p-2 mb-4" />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} className="border p-2 mb-4" />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}