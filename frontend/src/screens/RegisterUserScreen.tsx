import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function RegisterUserScreen() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [role, setRole] = useState<'admin' | 'user' | 'manager'>('user'); // default

  const handleRegister = async () => {
    if (!nome || !email || !senha || !confirmSenha || !role) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (senha !== confirmSenha) {
      Alert.alert('Atenção', 'As senhas não conferem.');
      return;
    }

    try {
      await axios.post('http://192.168.1.9:3000/usuarios', {
        nome,
        email,
        senha,
        role,
      });
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert('Erro', 'Falha ao cadastrar usuário.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Usuário</Text>
      <TextInput
        placeholder="Nome"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        placeholder="Email"
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
      <TextInput
        placeholder="Confirmar Senha"
        style={styles.input}
        value={confirmSenha}
        secureTextEntry
        onChangeText={setConfirmSenha}
      />
      <Text style={styles.label}>Selecione o papel:</Text>
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Usuário" value="user" />
        <Picker.Item label="Administrador" value="admin" />
        <Picker.Item label="Gerente" value="manager" />
      </Picker>
      <Button title="Salvar" onPress={handleRegister} color="#009A93"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
  },
  picker: {
    marginBottom: 20,
  },
});
