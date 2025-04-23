import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={[styles.container, darkMode && styles.dark]}>
      <Text style={[styles.title, darkMode && styles.textDark]}>Settings</Text>

      <View style={styles.settingRow}>
        <MaterialIcons name="dark-mode" size={24} color={darkMode ? 'white' : 'black'} />
        <Text style={[styles.label, darkMode && styles.textDark]}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  dark: { backgroundColor: '#111' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  textDark: { color: 'white' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  label: { fontSize: 18 },
});
