import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';


export default function LoginScreen({}) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');


  const handleLogin = async () => {
    try {
        await signIn(email, senha);
    } catch (error) {
        Alert.alert('Erro', 'Matrícula ou senha inválidos');
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Atenção', 'Informe sua matrícula para redefinir a senha.');
      return;
    }
    try {
      await axios.post('http://192.168.1.9:3000/auth/reset-password', { email });
      Alert.alert('Sucesso', 'Verifique seu e-mail para redefinir a senha.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar o e-mail.');
    }
  };

  return (
    
    <View style={styles.container}>
      <Image source={require('../assets/Logo2.png')} style={styles.logo} />
      <Text style={styles.title}>Bem-vindo</Text>
      <TextInput
        placeholder="E-mail"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Senha"
        style={styles.input}
        value={senha}
        secureTextEntry
        onChangeText={setSenha}
      />
      <Button title="Entrar" color={theme.colors.primary} onPress={handleLogin} />
      <Text style={styles.link} onPress={handleResetPassword}>Esqueceu a senha?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 180,             
    height: 180,
    marginBottom: 24,
    alignSelf: 'center',     
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: theme.fontSizes.title,
    marginBottom: 20,
    color: theme.colors.text,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
    backgroundColor: theme.colors.white,
  },
  link: {
    marginTop: 10,
    color: theme.colors.primary,
    textAlign: 'center',
  },
});
