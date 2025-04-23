import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function ReceivedScreen() {
  const [received, setReceived] = useState([]);

  useEffect(() => {
    const fetchReceived = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const user = await axios.get('http://localhost:8000/api/users/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const response = await axios.get('http://localhost:8000/api/transactions/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mine = response.data.filter(txn => txn.receiver === user.data.id);
        setReceived(mine);
      } catch (error) {
        Alert.alert('Failed to load received transactions', error.message);
      }
    };
    fetchReceived();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Received Transactions</Text>
      <FlatList
        data={received}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <MaterialIcons name="attach-money" size={20} />
            <Text style={styles.text}>From: {item.sender} | {item.amount} {item.currency}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  item: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  text: { marginLeft: 10, fontSize: 16 },
});
