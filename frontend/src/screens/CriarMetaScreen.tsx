import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { get, post } from '../services/api';

type Usuario = {
  matricula: number;
  nome: string;
  email: string;
  role: string;
};

export default function CriarMetaScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selecionados, setSelecionados] = useState<number[]>([]);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await get('/usuarios');
      setUsuarios(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error.message);
      Alert.alert('Erro ao buscar usuários');
    }
  };

  const toggleSelecionado = (matricula: number) => {
    setSelecionados(prev =>
      prev.includes(matricula)
        ? prev.filter(m => m !== matricula)
        : [...prev, matricula]
    );
  };

  const handleCreateMeta = async () => {
    if (!titulo || !descricao) {
      Alert.alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const dados = {
      titulo,
      descricao,
     criadorMatricula: Number(user?.matricula),
      participantesMatricula: selecionados,
    };


    console.log('Enviando:', dados);

    try {
      await post('/meta', dados);
      Alert.alert('Meta criada com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Erro ao criar meta:', error.message);
      Alert.alert('Erro ao criar meta', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Digite o título da meta"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Digite a descrição"
        multiline
      />

      <Text style={styles.label}>Atribuir para:</Text>
      {usuarios.map(usuario => (
        <TouchableOpacity
          key={usuario.matricula}
          style={[
            styles.usuarioItem,
            selecionados.includes(usuario.matricula) && styles.selecionado,
          ]}
          onPress={() => toggleSelecionado(usuario.matricula)}
        >
          <Text>{usuario.nome}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.botaoContainer}>
        <Button title="Criar Meta" onPress={handleCreateMeta} color="#009A93" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  usuarioItem: {
    padding: 10,
    marginVertical: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  selecionado: {
    backgroundColor: '#b2f0b2',
  },
  botaoContainer: {
    marginTop: 20,
  },
});
