import React, { useEffect, useState } from 'react';
import { View, Text, Alert, FlatList, TextInput, Button } from 'react-native';
import axios from 'axios';

export default function ExchangeScreen({ token }) {
  const [rates, setRates] = useState([]);
  const [base, setBase] = useState('USD');
  const [quote, setQuote] = useState('NGN');
  const [amount, setAmount] = useState('1');
  const [converted, setConverted] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/exchange/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRates(response.data);
      } catch (error) {
        Alert.alert('Error fetching exchange rates', error.message);
      }
    };
    fetchRates();
  }, []);

  const convert = () => {
    const rateObj = rates.find(r => r.base_currency === base && r.quote_currency === quote);
    if (rateObj) {
      const result = parseFloat(amount) * rateObj.rate;
      setConverted(result.toFixed(2));
    } else {
      Alert.alert('Rate not found');
    }
  };

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-2">Exchange Rates</Text>
      <FlatList
        data={rates}
        keyExtractor={item => `${item.base_currency}-${item.quote_currency}`}
        renderItem={({ item }) => (
          <Text className="text-base">
            {item.base_currency} → {item.quote_currency}: {item.rate}
          </Text>
        )}
      />
      <Text className="text-lg font-semibold mt-4">Convert Currency</Text>
      <TextInput placeholder="Base (USD)" value={base} onChangeText={setBase} className="border p-2 my-1" />
      <TextInput placeholder="Quote (NGN)" value={quote} onChangeText={setQuote} className="border p-2 my-1" />
      <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} className="border p-2 my-1" keyboardType="numeric" />
      <Button title="Convert" onPress={convert} />
      {converted && <Text className="mt-2 text-lg">Converted: {converted} {quote}</Text>}
    </View>
  );
}