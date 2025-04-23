import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TextInput, Button } from 'react-native';
import axios from 'axios';

export default function TransactionsScreen({ token }) {
  const [transactions, setTransactions] = useState([]);
  const [currency, setCurrency] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/transactions/?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
    } catch (error) {
      Alert.alert('Error fetching transactions', error.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const filtered = transactions.filter(txn => {
    return (
      (currency ? txn.currency === currency.toUpperCase() : true) &&
      (status ? txn.status === status.toLowerCase() : true)
    );
  });

  const nextPage = () => setPage(p => p + 1);
  const prevPage = () => setPage(p => Math.max(1, p - 1));

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-2">Transaction History</Text>
      <TextInput placeholder="Filter by Currency" value={currency} onChangeText={setCurrency} className="border p-2 my-1" />
      <TextInput placeholder="Filter by Status" value={status} onChangeText={setStatus} className="border p-2 my-1" />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Text className="text-base">
            {item.sender} → {item.receiver}: {item.amount} {item.currency} [{item.status}]
          </Text>
        )}
      />
      <View className="flex-row justify-between mt-2">
        <Button title="Previous" onPress={prevPage} />
        <Button title="Next" onPress={nextPage} />
      </View>
    </View>
  );
}
