import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function SendScreen({ token }) {
  const [receiverId, setReceiverId] = useState('');
  const [receiverQuery, setReceiverQuery] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [recentRecipients, setRecentRecipients] = useState([]);
  const [nicknameMap, setNicknameMap] = useState({});
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const storedMap = await AsyncStorage.getItem('nickname_map');
      if (storedMap) setNicknameMap(JSON.parse(storedMap));
      const resp = await axios.get('http://localhost:8000/api/transactions/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const last = resp.data.slice(-5);
      const unique = [...new Set(last.map(txn => txn.receiver))];
      setRecentRecipients(unique);
    };
    initialize();
  }, []);

  useEffect(() => {
    if (hasPermission === null) {
      BarCodeScanner.requestPermissionsAsync().then(({ status }) => setHasPermission(status === 'granted'));
    }
  }, []);

  const searchReceiver = async () => {
    try {
      const resp = await axios.get(`http://localhost:8000/api/users/?search=${receiverQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resp.data.length) {
        setReceiverId(String(resp.data[0].id));
        Alert.alert('Found', `User ID: ${resp.data[0].id}`);
      } else {
        Alert.alert('Not Found', 'No user matches that input');
      }
    } catch (error) {
      Alert.alert('Search Failed', error.message);
    }
  };

  const handleSend = async () => {
    try {
      await axios.post('http://localhost:8000/api/transactions/send/', {
        receiver_id: receiverId,
        amount,
        currency
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', `Sent $${amount} to user ${receiverId}`);
    } catch (error) {
      Alert.alert('Send Failed', error.message);
    }
  };

  const handleQRScan = () => setScanning(true);

  const onBarCodeScanned = ({ data }) => {
    setScanning(false);
    setReceiverId(data);
    Alert.alert('QR Scanned', `Receiver ID: ${data}`);
  };

  const mockPickContact = () => {
    setReceiverId('3');
    Alert.alert('Contact Picked', 'Receiver ID set to 3');
  };

  const saveNickname = async (id, name) => {
    const updatedMap = { ...nicknameMap, [id]: name };
    setNicknameMap(updatedMap);
    await AsyncStorage.setItem('nickname_map', JSON.stringify(updatedMap));
  };

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">Send Money</Text>
      <Button title="Scan QR Code" onPress={handleQRScan} />
      <Button title="Pick Contact" onPress={mockPickContact} />

      <TextInput placeholder="Search by username/email" value={receiverQuery} onChangeText={setReceiverQuery} className="border p-2 mt-4" />
      <Button title="Search" onPress={searchReceiver} />

      <TextInput placeholder="Receiver ID" value={receiverId} onChangeText={setReceiverId} className="border p-2 mb-2 mt-2" />
      <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} className="border p-2 mb-2" keyboardType="numeric" />
      <TextInput placeholder="Currency (e.g. USD)" value={currency} onChangeText={setCurrency} className="border p-2 mb-4" />
      <Button title="Send" onPress={handleSend} />

      <Text className="text-lg font-semibold mt-4">Recent Recipients</Text>
      <FlatList
        data={recentRecipients}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text className="text-base" onPress={() => setReceiverId(String(item))}>
              {nicknameMap[item] ? `${nicknameMap[item]} (ID: ${item})` : `User ID: ${item}`}
            </Text>
            <TextInput
              placeholder="Nickname"
              onSubmitEditing={(e) => saveNickname(item, e.nativeEvent.text)}
              className="border p-1"
            />
          </View>
        )}
      />

      <Modal visible={scanning} onRequestClose={() => setScanning(false)}>
        <BarCodeScanner
          onBarCodeScanned={onBarCodeScanned}
          style={{ flex: 1 }}
        />
      </Modal>
    </View>
  );
}



