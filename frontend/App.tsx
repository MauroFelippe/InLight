import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import Routes from './src/routes';

AsyncStorage.clear();


export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
