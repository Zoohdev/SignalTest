import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      await axios.post('http://localhost:8000/api/users/', {
        username,
        email,
        phone,
        password
      });
      Alert.alert('Signup Success', 'You can now login');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    }
  };

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">Signup</Text>
      <TextInput placeholder="Username" onChangeText={setUsername} value={username} className="border p-2 mb-2" />
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} className="border p-2 mb-2" />
      <TextInput placeholder="Phone" onChangeText={setPhone} value={phone} className="border p-2 mb-2" />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} className="border p-2 mb-4" />
      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
}
