// screens/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('access_token');
      try {
        const resp = await axios.get('http://localhost:8000/api/users/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(resp.data);
      } catch (err) {
        Alert.alert('Failed to fetch profile', err.message);
      }
    };
    fetchUser();
  }, []);

  if (!user) return <Text style={styles.loading}>Loading profile...</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
      <Text style={styles.name}>{user.username}</Text>
      <Text style={styles.email}><MaterialIcons name="email" size={16} /> {user.email}</Text>
      <Text style={styles.phone}><MaterialIcons name="phone" size={16} /> {user.phone}</Text>
      <Text style={styles.kyc}>KYC Verified: {user.kyc_verified ? 'Yes' : 'No'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: 'bold' },
  email: { fontSize: 16, marginTop: 8 },
  phone: { fontSize: 16, marginTop: 4 },
  kyc: { fontSize: 14, marginTop: 6, color: 'gray' },
  loading: { padding: 20, textAlign: 'center' },
});
