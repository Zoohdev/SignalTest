// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './screens/HomeScreen';
import SendScreen from './screens/SendScreen';
import WalletScreen from './screens/WalletScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ExchangeScreen from './screens/ExchangeScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import ReceivedScreen from './screens/ReceivedScreen';
import SplashScreen from './screens/SplashScreen';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [isSplash, setIsSplash] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const savedToken = await AsyncStorage.getItem('access_token');
      setToken(savedToken);
      setTimeout(() => setIsSplash(false), 1500);
    };
    checkToken();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('access_token');
    setToken(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isSplash ? (
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : !token ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Home">
                {props => <HomeScreen {...props} logout={logout} />}
              </Stack.Screen>
              <Stack.Screen name="Send">
                {props => <SendScreen {...props} token={token} />}
              </Stack.Screen>
              <Stack.Screen name="Wallet">
                {props => <WalletScreen {...props} token={token} />}
              </Stack.Screen>
              <Stack.Screen name="Exchange">
                {props => <ExchangeScreen {...props} token={token} />}
              </Stack.Screen>
              <Stack.Screen name="Transactions">
                {props => <TransactionsScreen {...props} token={token} />}
              </Stack.Screen>
              <Stack.Screen name="Received">
                {props => <ReceivedScreen {...props} token={token} />}
              </Stack.Screen>
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
