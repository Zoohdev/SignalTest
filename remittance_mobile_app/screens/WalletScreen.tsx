import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import axios from 'axios';

export default function WalletScreen({ token }) {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/wallets/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBalance(response.data[0]?.balance);
      } catch (error) {
        Alert.alert('Error fetching wallet', error.message);
      }
    };
    fetchBalance();
  }, []);

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-2">Wallet Balance</Text>
      <Text className="text-lg">{balance ? `$${balance}` : 'Loading...'}</Text>
    </View>
  );
}
