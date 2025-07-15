import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextData {
  user: { matricula: string; email: string; role: string } | null;
  isLoading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<{ matricula: string; email: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      const token = await AsyncStorage.getItem('token');
      const email = await AsyncStorage.getItem('email');
      const matricula = await AsyncStorage.getItem('matricula');
      const role = await AsyncStorage.getItem('role');

      if (token && email && matricula && role) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser({ matricula, email, role });
      }
      setIsLoading(false);
    };

    loadStorageData();
  }, []);

  const signIn = async (email: string, senha: string) => {
    const response = await axios.post('http://192.168.1.9:3000/usuarios/login', {
      email,
      senha,
    });

    const { access_token, usuario } = response.data.data;

    await AsyncStorage.setItem('token', access_token);
    await AsyncStorage.setItem('email', usuario.email);
    await AsyncStorage.setItem('matricula', usuario.matricula.toString());
    await AsyncStorage.setItem('role', usuario.role);

    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    setUser({
      email: usuario.email,
      matricula: usuario.matricula.toString(),
      role: usuario.role,
    });
  };

  const signOut = async () => {
    await AsyncStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
