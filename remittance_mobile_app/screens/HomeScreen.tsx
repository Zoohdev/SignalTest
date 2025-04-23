import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function HomeScreen({ logout, navigation }) {
  const features = [
    { label: 'Wallet', icon: 'account-balance-wallet', color: '#4CAF50', screen: 'Wallet' },
    { label: 'Send Money', icon: 'send', color: '#2196F3', screen: 'Send' },
    { label: 'Exchange', icon: 'swap-horiz', color: '#FFC107', screen: 'Exchange' },
    { label: 'Transactions', icon: 'receipt', color: '#9C27B0', screen: 'Transactions' },
    { label: 'Received', icon: 'download', color: '#FF5722', screen: 'Received' },
    { label: 'Profile', icon: 'person', color: '#607D8B', screen: 'Profile' },
    { label: 'Settings', icon: 'settings', color: '#795548', screen: 'Settings' }
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.grid}>
        {features.map(({ label, icon, color, screen }) => (
          <TouchableOpacity key={label} style={[styles.card, { backgroundColor: color }]} onPress={() => navigation.navigate(screen)}>
            <MaterialIcons name={icon} size={28} color="#fff" />
            <Text style={styles.cardText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  cardText: { color: '#fff', marginTop: 10, fontWeight: 'bold', fontSize: 16 },
  logout: {
    marginTop: 30,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoutText: { color: '#fff', fontWeight: 'bold', marginLeft: 10, fontSize: 16 }
});
